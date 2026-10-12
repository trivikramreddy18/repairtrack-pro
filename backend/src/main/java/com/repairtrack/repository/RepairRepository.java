package com.repairtrack.repository;

import com.repairtrack.entity.Priority;
import com.repairtrack.entity.Repair;
import com.repairtrack.entity.RepairStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface RepairRepository extends JpaRepository<Repair, Long> {
    Optional<Repair> findByTicketNumber(String ticketNumber);
    boolean existsByTicketNumber(String ticketNumber);

    List<Repair> findByDeviceIdOrderByReceivedDateDesc(Long deviceId);
    List<Repair> findByStatusOrderByReceivedDateDesc(RepairStatus status);
    List<Repair> findByPriorityOrderByReceivedDateDesc(Priority priority);
    List<Repair> findByAssignedTechnicianOrderByReceivedDateDesc(String assignedTechnician);

    long countByStatus(RepairStatus status);
    long countByPriority(Priority priority);

    @Query("SELECT r FROM Repair r JOIN r.device d JOIN d.customer c WHERE " +
           "LOWER(r.ticketNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.reportedProblem) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(r.assignedTechnician) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.serialNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY r.receivedDate DESC")
    List<Repair> searchRepairs(@Param("query") String query);

    @Query("SELECT r FROM Repair r JOIN r.device d JOIN d.customer c WHERE " +
           "(:status IS NULL OR r.status = :status) AND " +
           "(:priority IS NULL OR r.priority = :priority) AND " +
           "(:technician IS NULL OR LOWER(r.assignedTechnician) = LOWER(:technician)) AND " +
           "(:query IS NULL OR :query = '' OR " +
           " LOWER(r.ticketNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(r.reportedProblem) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(d.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(d.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           " LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY r.receivedDate DESC")
    List<Repair> filterRepairs(@Param("status") RepairStatus status,
                               @Param("priority") Priority priority,
                               @Param("technician") String technician,
                               @Param("query") String query);

    @Query("SELECT COALESCE(SUM(r.finalCost), 0) FROM Repair r WHERE r.status = 'DELIVERED'")
    BigDecimal calculateTotalDeliveredRevenue();

    @Query("SELECT COALESCE(SUM(r.estimatedCost), 0) FROM Repair r WHERE r.status IN ('RECEIVED', 'DIAGNOSING', 'IN_REPAIR', 'READY_FOR_PICKUP')")
    BigDecimal calculateActivePipelineCost();

    List<Repair> findTop10ByOrderByReceivedDateDesc();
}
