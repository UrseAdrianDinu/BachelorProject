package com.licenta.service.dto;

import javax.validation.constraints.NotNull;

public class DepartmentCreateDTO {

    @NotNull
    private String name;

    @NotNull
    private String code;

    private String email;
    private String description;
    private String parentDept;

    public DepartmentCreateDTO(String name, String code, String email, String description, String parentDept) {
        this.name = name;
        this.code = code;
        this.email = email;
        this.description = description;
        this.parentDept = parentDept;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getParentDept() {
        return parentDept;
    }

    public void setParentDept(String parentDept) {
        this.parentDept = parentDept;
    }
}
