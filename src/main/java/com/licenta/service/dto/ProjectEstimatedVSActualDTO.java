package com.licenta.service.dto;

import java.util.List;

public class ProjectEstimatedVSActualDTO {

    private String projectName;

    List<PhaseEstimatedVSActualDTO> phaseEstimatedVSActualDTOList;

    public ProjectEstimatedVSActualDTO() {}

    public ProjectEstimatedVSActualDTO(String projectName, List<PhaseEstimatedVSActualDTO> phaseEstimatedVSActualDTOList) {
        this.projectName = projectName;
        this.phaseEstimatedVSActualDTOList = phaseEstimatedVSActualDTOList;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public List<PhaseEstimatedVSActualDTO> getPhaseEstimatedVSActualDTOList() {
        return phaseEstimatedVSActualDTOList;
    }

    public void setPhaseEstimatedVSActualDTOList(List<PhaseEstimatedVSActualDTO> phaseEstimatedVSActualDTOList) {
        this.phaseEstimatedVSActualDTOList = phaseEstimatedVSActualDTOList;
    }
}
