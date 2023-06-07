package com.licenta.service.dto;

import java.util.Objects;

public class PersonUserDTO {

    private AdminUserDTO adminUserDTO;
    private PersonDTO personDTO;

    public PersonUserDTO(AdminUserDTO adminUserDTO, PersonDTO personDTO) {
        this.adminUserDTO = adminUserDTO;
        this.personDTO = personDTO;
    }

    public PersonUserDTO() {}

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        PersonUserDTO that = (PersonUserDTO) o;
        return (
            Objects.equals(this.adminUserDTO.getId(), that.adminUserDTO.getId()) &&
            Objects.equals(this.personDTO.getId(), that.personDTO.getId())
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(adminUserDTO, personDTO);
    }
}
