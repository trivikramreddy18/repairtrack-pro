package com.repairtrack.entity;

public enum RepairStatus {
    RECEIVED("Received"),
    DIAGNOSING("Diagnosing"),
    IN_REPAIR("In Repair"),
    READY_FOR_PICKUP("Ready for Pickup"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled");

    private final String displayName;

    RepairStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
