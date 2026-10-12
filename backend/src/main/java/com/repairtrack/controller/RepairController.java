package com.repairtrack.controller;

import com.repairtrack.dto.RepairCreateRequest;
import com.repairtrack.dto.RepairDTO;
import com.repairtrack.dto.RepairUpdateRequest;
import com.repairtrack.dto.StatusUpdateRequest;
import com.repairtrack.entity.Priority;
import com.repairtrack.entity.RepairStatus;
import com.repairtrack.service.RepairService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/repairs")
@CrossOrigin(originPatterns = "*")
public class RepairController {

    private final RepairService repairService;

    public RepairController(RepairService repairService) {
        this.repairService = repairService;
    }

    @GetMapping
    public ResponseEntity<List<RepairDTO>> getRepairs(
            @RequestParam(required = false) RepairStatus status,
            @RequestParam(required = false) Priority priority,
            @RequestParam(required = false) String technician,
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(repairService.filterRepairs(status, priority, technician, query));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepairDTO> getRepairById(@PathVariable Long id) {
        return ResponseEntity.ok(repairService.getRepairById(id));
    }

    @GetMapping("/track/{ticketNumber}")
    public ResponseEntity<RepairDTO> trackByTicket(@PathVariable String ticketNumber) {
        return ResponseEntity.ok(repairService.getRepairByTicketNumber(ticketNumber));
    }

    @PostMapping
    public ResponseEntity<RepairDTO> createRepair(@Valid @RequestBody RepairCreateRequest request) {
        RepairDTO created = repairService.createRepair(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepairDTO> updateRepair(@PathVariable Long id, @Valid @RequestBody RepairUpdateRequest request) {
        return ResponseEntity.ok(repairService.updateRepair(id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<RepairDTO> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(repairService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRepair(@PathVariable Long id) {
        repairService.deleteRepair(id);
        return ResponseEntity.noContent().build();
    }
}
