package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.SprintStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Sprint.
 */
@Entity
@Table(name = "sprint")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Sprint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "number")
    private Integer number;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SprintStatus status;

    @Column(name = "goal")
    private String goal;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @OneToMany(mappedBy = "sprint")
    @JsonIgnoreProperties(value = { "person", "project", "sprint", "team" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "risks", "sprints", "project" }, allowSetters = true)
    private Phase phase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Sprint id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getNumber() {
        return this.number;
    }

    public Sprint number(Integer number) {
        this.setNumber(number);
        return this;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public SprintStatus getStatus() {
        return this.status;
    }

    public Sprint status(SprintStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(SprintStatus status) {
        this.status = status;
    }

    public String getGoal() {
        return this.goal;
    }

    public Sprint goal(String goal) {
        this.setGoal(goal);
        return this;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Sprint startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Sprint endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setSprint(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setSprint(this));
        }
        this.tasks = tasks;
    }

    public Sprint tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Sprint addTask(Task task) {
        this.tasks.add(task);
        task.setSprint(this);
        return this;
    }

    public Sprint removeTask(Task task) {
        this.tasks.remove(task);
        task.setSprint(null);
        return this;
    }

    public Phase getPhase() {
        return this.phase;
    }

    public void setPhase(Phase phase) {
        this.phase = phase;
    }

    public Sprint phase(Phase phase) {
        this.setPhase(phase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Sprint)) {
            return false;
        }
        return id != null && id.equals(((Sprint) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Sprint{" +
            "id=" + getId() +
            ", number=" + getNumber() +
            ", status='" + getStatus() + "'" +
            ", goal='" + getGoal() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            "}";
    }
}
