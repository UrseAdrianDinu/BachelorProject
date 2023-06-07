package com.licenta.service.dto;

import java.time.LocalDate;

public class ProjectCreateDTO {

    private String name;
    private String code;
    private String domain;
    private String description;
    private LocalDate startDate;
    private boolean billable;

    public ProjectCreateDTO() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public boolean getBillable() {
        return billable;
    }

    public void setBillable(boolean billable) {
        this.billable = billable;
    }
}
