package com.repairtrack.service;

import com.repairtrack.dto.DeviceDTO;
import com.repairtrack.dto.DeviceRequest;
import com.repairtrack.entity.Customer;
import com.repairtrack.entity.Device;
import com.repairtrack.exception.DuplicateRecordException;
import com.repairtrack.exception.ResourceNotFoundException;
import com.repairtrack.repository.DeviceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final CustomerService customerService;

    public DeviceService(DeviceRepository deviceRepository, CustomerService customerService) {
        this.deviceRepository = deviceRepository;
        this.customerService = customerService;
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getAllDevices() {
        return deviceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> searchDevices(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllDevices();
        }
        return deviceRepository.searchDevices(query.trim())
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DeviceDTO> getDevicesByCustomer(Long customerId) {
        return deviceRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DeviceDTO getDeviceById(Long id) {
        Device device = getDeviceEntityById(id);
        return mapToDTO(device);
    }

    @Transactional(readOnly = true)
    public Device getDeviceEntityById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found with id: " + id));
    }

    public DeviceDTO createDevice(DeviceRequest request) {
        Customer customer = customerService.getCustomerEntityById(request.getCustomerId());

        // Duplicate check on serial number if supplied
        if (request.getSerialNumber() != null && !request.getSerialNumber().trim().isEmpty()) {
            String serial = request.getSerialNumber().trim();
            if (deviceRepository.existsBySerialNumber(serial)) {
                throw new DuplicateRecordException("A device with serial number '" + serial + "' already exists in the system.");
            }
        }

        Device device = new Device();
        device.setCustomer(customer);
        device.setDeviceType(request.getDeviceType().trim());
        device.setBrand(request.getBrand().trim());
        device.setModel(request.getModel().trim());
        device.setSerialNumber(request.getSerialNumber() != null ? request.getSerialNumber().trim() : null);
        device.setColor(request.getColor() != null ? request.getColor().trim() : null);
        device.setConditionNotes(request.getConditionNotes() != null ? request.getConditionNotes().trim() : null);
        device.setAccessories(request.getAccessories() != null ? request.getAccessories().trim() : null);

        Device saved = deviceRepository.save(device);
        return mapToDTO(saved);
    }

    public DeviceDTO updateDevice(Long id, DeviceRequest request) {
        Device device = getDeviceEntityById(id);

        if (request.getCustomerId() != null && !request.getCustomerId().equals(device.getCustomer().getId())) {
            Customer newCustomer = customerService.getCustomerEntityById(request.getCustomerId());
            device.setCustomer(newCustomer);
        }

        // Duplicate check on serial number
        if (request.getSerialNumber() != null && !request.getSerialNumber().trim().isEmpty()) {
            String serial = request.getSerialNumber().trim();
            if (deviceRepository.existsBySerialNumberAndIdNot(serial, id)) {
                throw new DuplicateRecordException("Another device already has serial number: " + serial);
            }
        }

        device.setDeviceType(request.getDeviceType().trim());
        device.setBrand(request.getBrand().trim());
        device.setModel(request.getModel().trim());
        device.setSerialNumber(request.getSerialNumber() != null ? request.getSerialNumber().trim() : null);
        device.setColor(request.getColor() != null ? request.getColor().trim() : null);
        device.setConditionNotes(request.getConditionNotes() != null ? request.getConditionNotes().trim() : null);
        device.setAccessories(request.getAccessories() != null ? request.getAccessories().trim() : null);

        Device saved = deviceRepository.save(device);
        return mapToDTO(saved);
    }

    public void deleteDevice(Long id) {
        Device device = getDeviceEntityById(id);
        deviceRepository.delete(device);
    }

    public DeviceDTO mapToDTO(Device device) {
        DeviceDTO dto = new DeviceDTO();
        dto.setId(device.getId());
        dto.setDeviceType(device.getDeviceType());
        dto.setBrand(device.getBrand());
        dto.setModel(device.getModel());
        dto.setSerialNumber(device.getSerialNumber());
        dto.setColor(device.getColor());
        dto.setConditionNotes(device.getConditionNotes());
        dto.setAccessories(device.getAccessories());
        dto.setCreatedAt(device.getCreatedAt());
        dto.setUpdatedAt(device.getUpdatedAt());

        if (device.getCustomer() != null) {
            dto.setCustomerId(device.getCustomer().getId());
            dto.setCustomerName(device.getCustomer().getName());
            dto.setCustomerPhone(device.getCustomer().getPhone());
            dto.setEmail(device.getCustomer().getEmail());
        }

        if (device.getRepairs() != null) {
            dto.setRepairsCount(device.getRepairs().size());
        } else {
            dto.setRepairsCount(0);
        }

        return dto;
    }
}
