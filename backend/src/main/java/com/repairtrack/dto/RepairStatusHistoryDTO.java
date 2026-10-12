package com.repairtrack.dto;

import com.repairtrack.entity.RepairStatus;
import java.time.LocalDateTime;

public class RepairStatusHistoryDTO {
    private Long id;
    private RepairStatus status;
    private String statusDisplayName;
    private String changedBy;
    private String notes;
    private LocalDateTime timestamp;

    public RepairStatusHistoryDTO() {
    }

    public RepairStatusHistoryDTO(Long id, RepairStatus status, String changedBy, String notes, LocalDateTime timestamp) {
        this.id = id;
        this.status = status;
        this.statusDisplayName = status != null ? status.getDisplayName() : null;
        this.changedBy = changedBy;
        this.notes = notes;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RepairStatus getStatus() {
        return status;
    }

    public void setStatus(RepairStatus status) {
        this.status = status;
        this.statusDisplayName = status != null ? status.getDisplayName() : null;
    }

    public String getStatusDisplayName() {
        return statusDisplayName;
    }

    public void setStatusDisplayName(String statusDisplayName) {
        this.statusDisplayName = statusDisplayName;
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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
