package com.licenta.service.dto;

import com.licenta.domain.enumeration.ProjectStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.licenta.domain.Project} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProjectDTO implements Serializable {

    private Long id;

    @NotNull
    private String name;

    @NotNull
    private String code;

    private String domain;

    private String description;

    private ProjectStatus status;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean billable;

    private Set<TeamDTO> teams = new HashSet<>();

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

    public ProjectStatus getStatus() {
        return status;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getBillable() {
        return billable;
    }

    public void setBillable(Boolean billable) {
        this.billable = billable;
    }

    public Set<TeamDTO> getTeams() {
        return teams;
    }

    public void setTeams(Set<TeamDTO> teams) {
        this.teams = teams;
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
        if (!(o instanceof ProjectDTO)) {
            return false;
        }

        ProjectDTO projectDTO = (ProjectDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, projectDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProjectDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", domain='" + getDomain() + "'" +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", billable='" + getBillable() + "'" +
            ", teams=" + getTeams() +
            ", company=" + getCompany() +
            "}";
    }
}
