package com.repairtrack.dto;

import com.repairtrack.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class RepairCreateRequest {

    @NotNull(message = "Device ID is required")
    private Long deviceId;

    @NotBlank(message = "Reported problem is required")
    private String reportedProblem;

    private Priority priority = Priority.MEDIUM;
    private BigDecimal estimatedCost = BigDecimal.ZERO;
    private String assignedTechnician;
    private LocalDateTime estimatedCompletionDate;

    public RepairCreateRequest() {
    }

    public Long getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Long deviceId) {
        this.deviceId = deviceId;
    }

    public String getReportedProblem() {
        return reportedProblem;
    }

    public void setReportedProblem(String reportedProblem) {
        this.reportedProblem = reportedProblem;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(BigDecimal estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getAssignedTechnician() {
        return assignedTechnician;
    }

    public void setAssignedTechnician(String assignedTechnician) {
        this.assignedTechnician = assignedTechnician;
    }

    public LocalDateTime getEstimatedCompletionDate() {
        return estimatedCompletionDate;
    }

    public void setEstimatedCompletionDate(LocalDateTime estimatedCompletionDate) {
        this.estimatedCompletionDate = estimatedCompletionDate;
    }
}
