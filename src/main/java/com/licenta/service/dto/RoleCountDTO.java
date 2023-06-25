package com.licenta.service.dto;

public class RoleCountDTO {

    private String roleName;
    private Long count;

    public RoleCountDTO() {}

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
