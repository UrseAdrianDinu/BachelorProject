package com.licenta.service.dto;

import com.licenta.domain.enumeration.PhaseStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.licenta.domain.Phase} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PhaseDTO implements Serializable {

    private Long id;

    private String name;

    private String objective;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private Integer estimatedTime;

    private PhaseStatus status;
    private ProjectDTO project;

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

    public String getObjective() {
        return objective;
    }

    public void setObjective(String objective) {
        this.objective = objective;
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

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public ProjectDTO getProject() {
        return project;
    }

    public void setProject(ProjectDTO project) {
        this.project = project;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PhaseDTO)) {
            return false;
        }

        PhaseDTO phaseDTO = (PhaseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, phaseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PhaseDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", objective='" + getObjective() + "'" +
            ", description='" + getDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", estimatedTime=" + getEstimatedTime() +
            ", project=" + getProject() +
            "}";
    }

    public PhaseStatus getStatus() {
        return status;
    }

    public void setStatus(PhaseStatus status) {
        this.status = status;
    }
}
