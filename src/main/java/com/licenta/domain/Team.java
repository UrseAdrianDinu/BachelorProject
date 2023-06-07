package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Team.
 */
@Entity
@Table(name = "team")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Team implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "team")
    @JsonIgnoreProperties(value = { "person", "project", "sprint", "team" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    @ManyToMany(mappedBy = "teams")
    @JsonIgnoreProperties(value = { "user", "tasks", "manager", "teams", "department", "role" }, allowSetters = true)
    private Set<Person> people = new HashSet<>();

    @ManyToMany(mappedBy = "teams")
    @JsonIgnoreProperties(value = { "tasks", "phases", "teams", "company" }, allowSetters = true)
    private Set<Project> projects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Team id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Team name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return this.email;
    }

    public Team email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setTeam(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setTeam(this));
        }
        this.tasks = tasks;
    }

    public Team tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Team addTask(Task task) {
        this.tasks.add(task);
        task.setTeam(this);
        return this;
    }

    public Team removeTask(Task task) {
        this.tasks.remove(task);
        task.setTeam(null);
        return this;
    }

    public Set<Person> getPeople() {
        return this.people;
    }

    public void setPeople(Set<Person> people) {
        if (this.people != null) {
            this.people.forEach(i -> i.removeTeam(this));
        }
        if (people != null) {
            people.forEach(i -> i.addTeam(this));
        }
        this.people = people;
    }

    public Team people(Set<Person> people) {
        this.setPeople(people);
        return this;
    }

    public Team addPerson(Person person) {
        this.people.add(person);
        person.getTeams().add(this);
        return this;
    }

    public Team removePerson(Person person) {
        this.people.remove(person);
        person.getTeams().remove(this);
        return this;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public void setProjects(Set<Project> projects) {
        if (this.projects != null) {
            this.projects.forEach(i -> i.removeTeam(this));
        }
        if (projects != null) {
            projects.forEach(i -> i.addTeam(this));
        }
        this.projects = projects;
    }

    public Team projects(Set<Project> projects) {
        this.setProjects(projects);
        return this;
    }

    public Team addProject(Project project) {
        this.projects.add(project);
        project.getTeams().add(this);
        return this;
    }

    public Team removeProject(Project project) {
        this.projects.remove(project);
        project.getTeams().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Team)) {
            return false;
        }
        return id != null && id.equals(((Team) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Team{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", email='" + getEmail() + "'" +
            "}";
    }
}
