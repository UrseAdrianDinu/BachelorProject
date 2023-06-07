package com.licenta.service.dto;

import com.licenta.domain.enumeration.TaskPriority;
import com.licenta.domain.enumeration.TaskStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.licenta.domain.Task} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TaskDTO implements Serializable {

    private Long id;

    @NotNull
    private String title;

    private String description;

    private TaskStatus status;

    private LocalDate startDate;

    private Float estimatedTime;

    private Float timeLogged;

    private Integer storyPoints;

    private TaskPriority priority;

    private String assignee;

    private String reporter;

    private PersonDTO person;

    private ProjectDTO project;

    private SprintDTO sprint;

    private TeamDTO team;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Float getEstimatedTime() {
        return estimatedTime;
    }

    public void setEstimatedTime(Float estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Float getTimeLogged() {
        return timeLogged;
    }

    public void setTimeLogged(Float timeLogged) {
        this.timeLogged = timeLogged;
    }

    public Integer getStoryPoints() {
        return storyPoints;
    }

    public void setStoryPoints(Integer storyPoints) {
        this.storyPoints = storyPoints;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReporter() {
        return reporter;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public PersonDTO getPerson() {
        return person;
    }

    public void setPerson(PersonDTO person) {
        this.person = person;
    }

    public ProjectDTO getProject() {
        return project;
    }

    public void setProject(ProjectDTO project) {
        this.project = project;
    }

    public SprintDTO getSprint() {
        return sprint;
    }

    public void setSprint(SprintDTO sprint) {
        this.sprint = sprint;
    }

    public TeamDTO getTeam() {
        return team;
    }

    public void setTeam(TeamDTO team) {
        this.team = team;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TaskDTO)) {
            return false;
        }

        TaskDTO taskDTO = (TaskDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, taskDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TaskDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", estimatedTime=" + getEstimatedTime() +
            ", timeLogged=" + getTimeLogged() +
            ", storyPoints=" + getStoryPoints() +
            ", priority='" + getPriority() + "'" +
            ", assignee='" + getAssignee() + "'" +
            ", reporter='" + getReporter() + "'" +
            ", person=" + getPerson() +
            ", project=" + getProject() +
            ", sprint=" + getSprint() +
            ", team=" + getTeam() +
            "}";
    }
}
