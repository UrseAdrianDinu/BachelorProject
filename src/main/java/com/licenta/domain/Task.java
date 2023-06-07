package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.TaskPriority;
import com.licenta.domain.enumeration.TaskStatus;
import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Task.
 */
@Entity
@Table(name = "task")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Task implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TaskStatus status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "estimated_time")
    private Float estimatedTime;

    @Column(name = "time_logged")
    private Float timeLogged;

    @Column(name = "story_points")
    private Integer storyPoints;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private TaskPriority priority;

    @Column(name = "assignee")
    private String assignee;

    @Column(name = "reporter")
    private String reporter;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "tasks", "manager", "teams", "department", "role" }, allowSetters = true)
    private Person person;

    @ManyToOne
    @JsonIgnoreProperties(value = { "tasks", "phases", "teams", "company" }, allowSetters = true)
    private Project project;

    @ManyToOne
    @JsonIgnoreProperties(value = { "tasks", "phase" }, allowSetters = true)
    private Sprint sprint;

    @ManyToOne
    @JsonIgnoreProperties(value = { "tasks", "people", "projects" }, allowSetters = true)
    private Team team;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Task id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Task title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Task description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return this.status;
    }

    public Task status(TaskStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Task startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public Float getEstimatedTime() {
        return this.estimatedTime;
    }

    public Task estimatedTime(Float estimatedTime) {
        this.setEstimatedTime(estimatedTime);
        return this;
    }

    public void setEstimatedTime(Float estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Float getTimeLogged() {
        return this.timeLogged;
    }

    public Task timeLogged(Float timeLogged) {
        this.setTimeLogged(timeLogged);
        return this;
    }

    public void setTimeLogged(Float timeLogged) {
        this.timeLogged = timeLogged;
    }

    public Integer getStoryPoints() {
        return this.storyPoints;
    }

    public Task storyPoints(Integer storyPoints) {
        this.setStoryPoints(storyPoints);
        return this;
    }

    public void setStoryPoints(Integer storyPoints) {
        this.storyPoints = storyPoints;
    }

    public TaskPriority getPriority() {
        return this.priority;
    }

    public Task priority(TaskPriority priority) {
        this.setPriority(priority);
        return this;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public String getAssignee() {
        return this.assignee;
    }

    public Task assignee(String assignee) {
        this.setAssignee(assignee);
        return this;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getReporter() {
        return this.reporter;
    }

    public Task reporter(String reporter) {
        this.setReporter(reporter);
        return this;
    }

    public void setReporter(String reporter) {
        this.reporter = reporter;
    }

    public Person getPerson() {
        return this.person;
    }

    public void setPerson(Person person) {
        this.person = person;
    }

    public Task person(Person person) {
        this.setPerson(person);
        return this;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Task project(Project project) {
        this.setProject(project);
        return this;
    }

    public Sprint getSprint() {
        return this.sprint;
    }

    public void setSprint(Sprint sprint) {
        this.sprint = sprint;
    }

    public Task sprint(Sprint sprint) {
        this.setSprint(sprint);
        return this;
    }

    public Team getTeam() {
        return this.team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public Task team(Team team) {
        this.setTeam(team);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Task)) {
            return false;
        }
        return id != null && id.equals(((Task) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Task{" +
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
            "}";
    }
}
