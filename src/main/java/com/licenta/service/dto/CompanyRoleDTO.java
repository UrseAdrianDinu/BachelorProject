package com.licenta.service.dto;

public class CompanyRoleDTO {

    private CompanyDTO companyDTO;
    private RoleDTO roleDTO;

    public CompanyRoleDTO(CompanyDTO companyDTO, RoleDTO roleDTO) {
        this.companyDTO = companyDTO;
        this.roleDTO = roleDTO;
    }

    public CompanyRoleDTO() {}

    public CompanyDTO getCompanyDTO() {
        return companyDTO;
    }

    public void setCompanyDTO(CompanyDTO companyDTO) {
        this.companyDTO = companyDTO;
    }

    public RoleDTO getRoleDTO() {
        return roleDTO;
    }

    public void setRoleDTO(RoleDTO roleDTO) {
        this.roleDTO = roleDTO;
    }

    @Override
    public String toString() {
        return "CompanyRoleDTO{" + "companyDTO=" + companyDTO.toString() + ", roleDTO=" + roleDTO.toString() + '}';
    }
}
