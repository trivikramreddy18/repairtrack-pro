package com.repairtrack.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private long totalCustomers;
    private long totalDevices;
    private long totalRepairs;
    private long activeRepairs;
    private long readyForPickup;
    private long deliveredRepairs;
    private BigDecimal totalDeliveredRevenue;
    private BigDecimal activePipelineValue;
    private Map<String, Long> statusCounts;
    private Map<String, Long> priorityCounts;
    private List<RepairDTO> recentRepairs;

    public DashboardStatsDTO() {
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalDevices() {
        return totalDevices;
    }

    public void setTotalDevices(long totalDevices) {
        this.totalDevices = totalDevices;
    }

    public long getTotalRepairs() {
        return totalRepairs;
    }

    public void setTotalRepairs(long totalRepairs) {
        this.totalRepairs = totalRepairs;
    }

    public long getActiveRepairs() {
        return activeRepairs;
    }

    public void setActiveRepairs(long activeRepairs) {
        this.activeRepairs = activeRepairs;
    }

    public long getReadyForPickup() {
        return readyForPickup;
    }

    public void setReadyForPickup(long readyForPickup) {
        this.readyForPickup = readyForPickup;
    }

    public long getDeliveredRepairs() {
        return deliveredRepairs;
    }

    public void setDeliveredRepairs(long deliveredRepairs) {
        this.deliveredRepairs = deliveredRepairs;
    }

    public BigDecimal getTotalDeliveredRevenue() {
        return totalDeliveredRevenue;
    }

    public void setTotalDeliveredRevenue(BigDecimal totalDeliveredRevenue) {
        this.totalDeliveredRevenue = totalDeliveredRevenue;
    }

    public BigDecimal getActivePipelineValue() {
        return activePipelineValue;
    }

    public void setActivePipelineValue(BigDecimal activePipelineValue) {
        this.activePipelineValue = activePipelineValue;
    }

    public Map<String, Long> getStatusCounts() {
        return statusCounts;
    }

    public void setStatusCounts(Map<String, Long> statusCounts) {
        this.statusCounts = statusCounts;
    }

    public Map<String, Long> getPriorityCounts() {
        return priorityCounts;
    }

    public void setPriorityCounts(Map<String, Long> priorityCounts) {
        this.priorityCounts = priorityCounts;
    }

    public List<RepairDTO> getRecentRepairs() {
        return recentRepairs;
    }

    public void setRecentRepairs(List<RepairDTO> recentRepairs) {
        this.recentRepairs = recentRepairs;
    }
}
