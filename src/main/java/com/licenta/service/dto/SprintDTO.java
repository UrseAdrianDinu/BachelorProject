package com.licenta.service.dto;

import com.licenta.domain.enumeration.SprintStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A DTO for the {@link com.licenta.domain.Sprint} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SprintDTO implements Serializable {

    private Long id;

    private Integer number;

    private SprintStatus status;

    private String goal;

    private LocalDate startDate;

    private LocalDate endDate;

    private PhaseDTO phase;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public SprintStatus getStatus() {
        return status;
    }

    public void setStatus(SprintStatus status) {
        this.status = status;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
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

    public PhaseDTO getPhase() {
        return phase;
    }

    public void setPhase(PhaseDTO phase) {
        this.phase = phase;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SprintDTO)) {
            return false;
        }

        SprintDTO sprintDTO = (SprintDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, sprintDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SprintDTO{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            ", status='" + getStatus() + "'" +
            ", goal='" + getGoal() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", phase=" + getPhase() +
            "}";
    }
}
