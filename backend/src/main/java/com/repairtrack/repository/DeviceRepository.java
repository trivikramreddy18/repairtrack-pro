package com.repairtrack.repository;

import com.repairtrack.entity.Device;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    Optional<Device> findBySerialNumber(String serialNumber);
    boolean existsBySerialNumber(String serialNumber);
    boolean existsBySerialNumberAndIdNot(String serialNumber, Long id);

    @Query("SELECT d FROM Device d JOIN d.customer c WHERE " +
           "LOWER(d.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.model) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.serialNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.deviceType) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.phone) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY d.createdAt DESC")
    List<Device> searchDevices(@Param("query") String query);

    List<Device> findAllByOrderByCreatedAtDesc();
}
