package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.ProjectStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Project.
 */
@Entity
@Table(name = "project")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "domain")
    private String domain;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ProjectStatus status;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "billable")
    private Boolean billable;

    @OneToMany(mappedBy = "project")
    @JsonIgnoreProperties(value = { "person", "project", "sprint", "team" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    @OneToMany(mappedBy = "project")
    @JsonIgnoreProperties(value = { "risks", "sprints", "project" }, allowSetters = true)
    private Set<Phase> phases = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_project__team",
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    @JsonIgnoreProperties(value = { "tasks", "people", "projects" }, allowSetters = true)
    private Set<Team> teams = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "departments", "projects" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Project id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Project name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public Project code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDomain() {
        return this.domain;
    }

    public Project domain(String domain) {
        this.setDomain(domain);
        return this;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getDescription() {
        return this.description;
    }

    public Project description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProjectStatus getStatus() {
        return this.status;
    }

    public Project status(ProjectStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(ProjectStatus status) {
        this.status = status;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Project startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Project endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Boolean getBillable() {
        return this.billable;
    }

    public Project billable(Boolean billable) {
        this.setBillable(billable);
        return this;
    }

    public void setBillable(Boolean billable) {
        this.billable = billable;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setProject(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setProject(this));
        }
        this.tasks = tasks;
    }

    public Project tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Project addTask(Task task) {
        this.tasks.add(task);
        task.setProject(this);
        return this;
    }

    public Project removeTask(Task task) {
        this.tasks.remove(task);
        task.setProject(null);
        return this;
    }

    public Set<Phase> getPhases() {
        return this.phases;
    }

    public void setPhases(Set<Phase> phases) {
        if (this.phases != null) {
            this.phases.forEach(i -> i.setProject(null));
        }
        if (phases != null) {
            phases.forEach(i -> i.setProject(this));
        }
        this.phases = phases;
    }

    public Project phases(Set<Phase> phases) {
        this.setPhases(phases);
        return this;
    }

    public Project addPhase(Phase phase) {
        this.phases.add(phase);
        phase.setProject(this);
        return this;
    }

    public Project removePhase(Phase phase) {
        this.phases.remove(phase);
        phase.setProject(null);
        return this;
    }

    public Set<Team> getTeams() {
        return this.teams;
    }

    public void setTeams(Set<Team> teams) {
        this.teams = teams;
    }

    public Project teams(Set<Team> teams) {
        this.setTeams(teams);
        return this;
    }

    public Project addTeam(Team team) {
        this.teams.add(team);
        team.getProjects().add(this);
        return this;
    }

    public Project removeTeam(Team team) {
        this.teams.remove(team);
        team.getProjects().remove(this);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Project company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return id != null && id.equals(((Project) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", domain='" + getDomain() + "'" +
            ", description='" + getDescription() + "'" +
            ", status='" + getStatus() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", billable='" + getBillable() + "'" +
            "}";
    }
}
