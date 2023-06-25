package com.licenta.service.dto;

public class ProjectCountDTO {

    private String projectName;
    private Long count;

    public ProjectCountDTO(String projectName, Long count) {
        this.projectName = projectName;
        this.count = count;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
