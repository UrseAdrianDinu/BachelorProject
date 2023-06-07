package com.licenta.service.dto;

import com.licenta.domain.enumeration.RoleSeniority;
import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.licenta.domain.Role} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RoleDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String code;

    private RoleSeniority seniority;

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

    public RoleSeniority getSeniority() {
        return seniority;
    }

    public void setSeniority(RoleSeniority seniority) {
        this.seniority = seniority;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RoleDTO)) {
            return false;
        }

        RoleDTO roleDTO = (RoleDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, roleDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RoleDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", seniority='" + getSeniority() + "'" +
            "}";
    }
}
