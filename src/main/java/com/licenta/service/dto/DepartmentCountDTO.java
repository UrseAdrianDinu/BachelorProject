package com.licenta.service.dto;

public class DepartmentCountDTO {

    private String departmentName;
    private Long count;

    public DepartmentCountDTO() {}

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
