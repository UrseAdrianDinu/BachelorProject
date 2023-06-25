package com.licenta.service.dto;

public class PhaseEstimatedVSActualDTO {

    private String phaseName;
    private float estimatedHours;
    private float actualHours;

    public PhaseEstimatedVSActualDTO() {}

    public PhaseEstimatedVSActualDTO(String phaseName, float estimatedHours, float actualHours) {
        this.phaseName = phaseName;
        this.estimatedHours = estimatedHours;
        this.actualHours = actualHours;
    }

    public String getPhaseName() {
        return phaseName;
    }

    public void setPhaseName(String phaseName) {
        this.phaseName = phaseName;
    }

    public float getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(float estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public float getActualHours() {
        return actualHours;
    }

    public void setActualHours(float actualHours) {
        this.actualHours = actualHours;
    }
}
