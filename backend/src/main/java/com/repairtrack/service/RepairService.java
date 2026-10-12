package com.repairtrack.service;

import com.repairtrack.dto.*;
import com.repairtrack.entity.*;
import com.repairtrack.exception.ResourceNotFoundException;
import com.repairtrack.repository.RepairRepository;
import com.repairtrack.repository.RepairStatusHistoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@Transactional
public class RepairService {

    private final RepairRepository repairRepository;
    private final RepairStatusHistoryRepository historyRepository;
    private final DeviceService deviceService;

    public RepairService(RepairRepository repairRepository,
                         RepairStatusHistoryRepository historyRepository,
                         DeviceService deviceService) {
        this.repairRepository = repairRepository;
        this.historyRepository = historyRepository;
        this.deviceService = deviceService;
    }

    @Transactional(readOnly = true)
    public List<RepairDTO> getAllRepairs() {
        return repairRepository.findAll(org.springframework.data.domain.Sort.by(
                org.springframework.data.domain.Sort.Direction.DESC, "receivedDate"))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RepairDTO> filterRepairs(RepairStatus status, Priority priority, String technician, String query) {
        return repairRepository.filterRepairs(status, priority, technician, query)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RepairDTO getRepairById(Long id) {
        Repair repair = getRepairEntityById(id);
        return mapToDTO(repair);
    }

    @Transactional(readOnly = true)
    public RepairDTO getRepairByTicketNumber(String ticketNumber) {
        Repair repair = repairRepository.findByTicketNumber(ticketNumber.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Repair ticket not found with number: " + ticketNumber));
        return mapToDTO(repair);
    }

    @Transactional(readOnly = true)
    public List<RepairDTO> getRepairsByDeviceId(Long deviceId) {
        return repairRepository.findByDeviceIdOrderByReceivedDateDesc(deviceId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Repair getRepairEntityById(Long id) {
        return repairRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Repair not found with id: " + id));
    }

    public RepairDTO createRepair(RepairCreateRequest request) {
        Device device = deviceService.getDeviceEntityById(request.getDeviceId());

        Repair repair = new Repair();
        repair.setDevice(device);
        repair.setTicketNumber(generateUniqueTicketNumber());
        repair.setReportedProblem(request.getReportedProblem().trim());
        repair.setPriority(request.getPriority() != null ? request.getPriority() : Priority.MEDIUM);
        repair.setEstimatedCost(request.getEstimatedCost() != null ? request.getEstimatedCost() : BigDecimal.ZERO);
        repair.setAssignedTechnician(request.getAssignedTechnician() != null ? request.getAssignedTechnician().trim() : null);
        repair.setEstimatedCompletionDate(request.getEstimatedCompletionDate());
        repair.setStatus(RepairStatus.RECEIVED);
        repair.setReceivedDate(LocalDateTime.now());

        Repair saved = repairRepository.save(repair);

        // Record initial status history
        RepairStatusHistory initialHistory = new RepairStatusHistory(
                saved,
                RepairStatus.RECEIVED,
                request.getAssignedTechnician() != null ? request.getAssignedTechnician() : "Front Desk",
                "Repair ticket created and device received in repair center."
        );
        historyRepository.save(initialHistory);

        return mapToDTO(saved);
    }

    public RepairDTO updateRepair(Long id, RepairUpdateRequest request) {
        Repair repair = getRepairEntityById(id);
        RepairStatus oldStatus = repair.getStatus();

        if (request.getReportedProblem() != null && !request.getReportedProblem().trim().isEmpty()) {
            repair.setReportedProblem(request.getReportedProblem().trim());
        }
        if (request.getDiagnosisDetails() != null) {
            repair.setDiagnosisDetails(request.getDiagnosisDetails().trim());
        }
        if (request.getTechnicianNotes() != null) {
            repair.setTechnicianNotes(request.getTechnicianNotes().trim());
        }
        if (request.getPriority() != null) {
            repair.setPriority(request.getPriority());
        }
        if (request.getEstimatedCost() != null) {
            repair.setEstimatedCost(request.getEstimatedCost());
        }
        if (request.getPartsCost() != null) {
            repair.setPartsCost(request.getPartsCost());
        }
        if (request.getLaborCost() != null) {
            repair.setLaborCost(request.getLaborCost());
        }

        // Calculate final cost if parts and labor are given, or use explicit final cost
        if (request.getFinalCost() != null && request.getFinalCost().compareTo(BigDecimal.ZERO) > 0) {
            repair.setFinalCost(request.getFinalCost());
        } else {
            BigDecimal parts = repair.getPartsCost() != null ? repair.getPartsCost() : BigDecimal.ZERO;
            BigDecimal labor = repair.getLaborCost() != null ? repair.getLaborCost() : BigDecimal.ZERO;
            if (parts.compareTo(BigDecimal.ZERO) > 0 || labor.compareTo(BigDecimal.ZERO) > 0) {
                repair.setFinalCost(parts.add(labor));
            }
        }

        if (request.getAssignedTechnician() != null) {
            repair.setAssignedTechnician(request.getAssignedTechnician().trim());
        }
        if (request.getEstimatedCompletionDate() != null) {
            repair.setEstimatedCompletionDate(request.getEstimatedCompletionDate());
        }

        // Handle status transition if status provided and changed
        if (request.getStatus() != null && request.getStatus() != oldStatus) {
            applyStatusChange(repair, request.getStatus(),
                    repair.getAssignedTechnician() != null ? repair.getAssignedTechnician() : "Technician",
                    "Status updated during general repair update.");
        }

        Repair saved = repairRepository.save(repair);
        return mapToDTO(saved);
    }

    public RepairDTO updateStatus(Long id, StatusUpdateRequest request) {
        Repair repair = getRepairEntityById(id);

        if (request.getStatus() == null) {
            throw new IllegalArgumentException("Target status must not be null");
        }

        applyStatusChange(repair, request.getStatus(), request.getChangedBy(), request.getNotes());
        Repair saved = repairRepository.save(repair);
        return mapToDTO(saved);
    }

    private void applyStatusChange(Repair repair, RepairStatus newStatus, String changedBy, String notes) {
        repair.setStatus(newStatus);
        LocalDateTime now = LocalDateTime.now();

        if (newStatus == RepairStatus.READY_FOR_PICKUP) {
            repair.setCompletedDate(now);
        } else if (newStatus == RepairStatus.DELIVERED) {
            if (repair.getCompletedDate() == null) {
                repair.setCompletedDate(now);
            }
            repair.setDeliveredDate(now);
        }

        RepairStatusHistory history = new RepairStatusHistory(
                repair,
                newStatus,
                changedBy != null ? changedBy : "System",
                notes != null && !notes.trim().isEmpty() ? notes.trim() : "Status progressed to " + newStatus.getDisplayName()
        );
        historyRepository.save(history);
    }

    public void deleteRepair(Long id) {
        Repair repair = getRepairEntityById(id);
        repairRepository.delete(repair);
    }

    private String generateUniqueTicketNumber() {
        String datePrefix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String ticket;
        do {
            int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
            ticket = "REP-" + datePrefix + "-" + randomNum;
        } while (repairRepository.existsByTicketNumber(ticket));
        return ticket;
    }

    public RepairDTO mapToDTO(Repair repair) {
        RepairDTO dto = new RepairDTO();
        dto.setId(repair.getId());
        dto.setTicketNumber(repair.getTicketNumber());
        dto.setReportedProblem(repair.getReportedProblem());
        dto.setDiagnosisDetails(repair.getDiagnosisDetails());
        dto.setTechnicianNotes(repair.getTechnicianNotes());
        dto.setStatus(repair.getStatus());
        dto.setStatusDisplayName(repair.getStatus() != null ? repair.getStatus().getDisplayName() : null);
        dto.setPriority(repair.getPriority());
        dto.setEstimatedCost(repair.getEstimatedCost());
        dto.setPartsCost(repair.getPartsCost());
        dto.setLaborCost(repair.getLaborCost());
        dto.setFinalCost(repair.getFinalCost());
        dto.setAssignedTechnician(repair.getAssignedTechnician());
        dto.setReceivedDate(repair.getReceivedDate());
        dto.setEstimatedCompletionDate(repair.getEstimatedCompletionDate());
        dto.setCompletedDate(repair.getCompletedDate());
        dto.setDeliveredDate(repair.getDeliveredDate());
        dto.setCreatedAt(repair.getCreatedAt());
        dto.setUpdatedAt(repair.getUpdatedAt());

        Device dev = repair.getDevice();
        if (dev != null) {
            dto.setDeviceId(dev.getId());
            dto.setDeviceType(dev.getDeviceType());
            dto.setBrand(dev.getBrand());
            dto.setModel(dev.getModel());
            dto.setSerialNumber(dev.getSerialNumber());
            dto.setColor(dev.getColor());

            if (dev.getCustomer() != null) {
                dto.setCustomerId(dev.getCustomer().getId());
                dto.setCustomerName(dev.getCustomer().getName());
                dto.setCustomerPhone(dev.getCustomer().getPhone());
                dto.setCustomerEmail(dev.getCustomer().getEmail());
                dto.setCustomerAddress(dev.getCustomer().getAddress());
            }
        }

        List<RepairStatusHistoryDTO> historyDTOs = historyRepository.findByRepairIdOrderByTimestampDesc(repair.getId())
                .stream()
                .map(h -> new RepairStatusHistoryDTO(
                        h.getId(),
                        h.getStatus(),
                        h.getChangedBy(),
                        h.getNotes(),
                        h.getTimestamp()))
                .collect(Collectors.toList());
        dto.setStatusHistory(historyDTOs);

        return dto;
    }
}
