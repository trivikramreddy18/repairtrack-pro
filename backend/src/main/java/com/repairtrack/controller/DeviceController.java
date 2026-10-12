package com.repairtrack.controller;

import com.repairtrack.dto.DeviceDTO;
import com.repairtrack.dto.DeviceRequest;
import com.repairtrack.dto.RepairDTO;
import com.repairtrack.service.DeviceService;
import com.repairtrack.service.RepairService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(originPatterns = "*")
public class DeviceController {

    private final DeviceService deviceService;
    private final RepairService repairService;

    public DeviceController(DeviceService deviceService, RepairService repairService) {
        this.deviceService = deviceService;
        this.repairService = repairService;
    }

    @GetMapping
    public ResponseEntity<List<DeviceDTO>> getDevices(@RequestParam(required = false) Long customerId,
                                                      @RequestParam(required = false) String search) {
        if (customerId != null) {
            return ResponseEntity.ok(deviceService.getDevicesByCustomer(customerId));
        }
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(deviceService.searchDevices(search));
        }
        return ResponseEntity.ok(deviceService.getAllDevices());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeviceDTO> getDeviceById(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceById(id));
    }

    @GetMapping("/{id}/repairs")
    public ResponseEntity<List<RepairDTO>> getDeviceRepairs(@PathVariable Long id) {
        return ResponseEntity.ok(repairService.getRepairsByDeviceId(id));
    }

    @PostMapping
    public ResponseEntity<DeviceDTO> createDevice(@Valid @RequestBody DeviceRequest request) {
        DeviceDTO created = deviceService.createDevice(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DeviceDTO> updateDevice(@PathVariable Long id, @Valid @RequestBody DeviceRequest request) {
        return ResponseEntity.ok(deviceService.updateDevice(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
}
