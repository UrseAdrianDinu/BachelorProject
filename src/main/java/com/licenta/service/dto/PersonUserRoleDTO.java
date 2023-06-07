package com.licenta.service.dto;

public class PersonUserRoleDTO {

    private AdminUserDTO adminUserDTO;
    private PersonDTO personDTO;
    private RoleDTO roleDTO;

    public PersonUserRoleDTO(AdminUserDTO adminUserDTO, PersonDTO personDTO, RoleDTO roleDTO) {
        this.adminUserDTO = adminUserDTO;
        this.personDTO = personDTO;
        this.roleDTO = roleDTO;
    }

    public PersonUserRoleDTO() {}

    public AdminUserDTO getAdminUserDTO() {
        return adminUserDTO;
    }

    public void setAdminUserDTO(AdminUserDTO adminUserDTO) {
        this.adminUserDTO = adminUserDTO;
    }

    public PersonDTO getPersonDTO() {
        return personDTO;
    }

    public void setPersonDTO(PersonDTO personDTO) {
        this.personDTO = personDTO;
    }

    public RoleDTO getRoleDTO() {
        return roleDTO;
    }

    public void setRoleDTO(RoleDTO roleDTO) {
        this.roleDTO = roleDTO;
    }
}
