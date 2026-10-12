package com.repairtrack.dto;

import com.repairtrack.entity.RepairStatus;
import jakarta.validation.constraints.NotNull;

public class StatusUpdateRequest {

    @NotNull(message = "New status is required")
    private RepairStatus status;

    private String changedBy;
    private String notes;

    public StatusUpdateRequest() {
    }

    public StatusUpdateRequest(RepairStatus status, String changedBy, String notes) {
        this.status = status;
        this.changedBy = changedBy;
        this.notes = notes;
    }

    public RepairStatus getStatus() {
        return status;
    }

    public void setStatus(RepairStatus status) {
        this.status = status;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
