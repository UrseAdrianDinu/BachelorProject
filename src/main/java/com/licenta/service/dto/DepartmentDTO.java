package com.licenta.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.licenta.domain.Department} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DepartmentDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String code;

    private String email;

    private String description;

    private DepartmentDTO parentDept;

    private CompanyDTO company;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public DepartmentDTO getParentDept() {
        return parentDept;
    }

    public void setParentDept(DepartmentDTO parentDept) {
        this.parentDept = parentDept;
    }

    public CompanyDTO getCompany() {
        return company;
    }

    public void setCompany(CompanyDTO company) {
        this.company = company;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DepartmentDTO)) {
            return false;
        }

        DepartmentDTO departmentDTO = (DepartmentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, departmentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DepartmentDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", email='" + getEmail() + "'" +
            ", description='" + getDescription() + "'" +
            ", parentDept=" + getParentDept() +
            ", company=" + getCompany() +
            "}";
    }
}
