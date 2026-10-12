package com.repairtrack.service;

import com.repairtrack.dto.DashboardStatsDTO;
import com.repairtrack.dto.RepairDTO;
import com.repairtrack.entity.Priority;
import com.repairtrack.entity.RepairStatus;
import com.repairtrack.repository.CustomerRepository;
import com.repairtrack.repository.DeviceRepository;
import com.repairtrack.repository.RepairRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final CustomerRepository customerRepository;
    private final DeviceRepository deviceRepository;
    private final RepairRepository repairRepository;
    private final RepairService repairService;

    public DashboardService(CustomerRepository customerRepository,
                            DeviceRepository deviceRepository,
                            RepairRepository repairRepository,
                            RepairService repairService) {
        this.customerRepository = customerRepository;
        this.deviceRepository = deviceRepository;
        this.repairRepository = repairRepository;
        this.repairService = repairService;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalCustomers(customerRepository.count());
        stats.setTotalDevices(deviceRepository.count());
        stats.setTotalRepairs(repairRepository.count());

        long received = repairRepository.countByStatus(RepairStatus.RECEIVED);
        long diagnosing = repairRepository.countByStatus(RepairStatus.DIAGNOSING);
        long inRepair = repairRepository.countByStatus(RepairStatus.IN_REPAIR);
        long readyForPickup = repairRepository.countByStatus(RepairStatus.READY_FOR_PICKUP);
        long delivered = repairRepository.countByStatus(RepairStatus.DELIVERED);
        long cancelled = repairRepository.countByStatus(RepairStatus.CANCELLED);

        stats.setActiveRepairs(received + diagnosing + inRepair);
        stats.setReadyForPickup(readyForPickup);
        stats.setDeliveredRepairs(delivered);

        BigDecimal revenue = repairRepository.calculateTotalDeliveredRevenue();
        stats.setTotalDeliveredRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        BigDecimal pipeline = repairRepository.calculateActivePipelineCost();
        stats.setActivePipelineValue(pipeline != null ? pipeline : BigDecimal.ZERO);

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put(RepairStatus.RECEIVED.name(), received);
        statusCounts.put(RepairStatus.DIAGNOSING.name(), diagnosing);
        statusCounts.put(RepairStatus.IN_REPAIR.name(), inRepair);
        statusCounts.put(RepairStatus.READY_FOR_PICKUP.name(), readyForPickup);
        statusCounts.put(RepairStatus.DELIVERED.name(), delivered);
        statusCounts.put(RepairStatus.CANCELLED.name(), cancelled);
        stats.setStatusCounts(statusCounts);

        Map<String, Long> priorityCounts = new HashMap<>();
        for (Priority priority : Priority.values()) {
            priorityCounts.put(priority.name(), repairRepository.countByPriority(priority));
        }
        stats.setPriorityCounts(priorityCounts);

        List<RepairDTO> recentRepairs = repairRepository.findTop10ByOrderByReceivedDateDesc()
                .stream()
                .map(repairService::mapToDTO)
                .collect(Collectors.toList());
        stats.setRecentRepairs(recentRepairs);

        return stats;
    }
}
