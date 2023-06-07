package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Department.
 */
@Entity
@Table(name = "department")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Department implements Serializable {

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

    @Column(name = "email")
    private String email;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "department")
    @JsonIgnoreProperties(value = { "user", "tasks", "manager", "teams", "department", "role" }, allowSetters = true)
    private Set<Person> people = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "people", "parentDept", "company" }, allowSetters = true)
    private Department parentDept;

    @ManyToOne
    @JsonIgnoreProperties(value = { "departments", "projects" }, allowSetters = true)
    private Company company;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Department id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Department name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public Department code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEmail() {
        return this.email;
    }

    public Department email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDescription() {
        return this.description;
    }

    public Department description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Person> getPeople() {
        return this.people;
    }

    public void setPeople(Set<Person> people) {
        if (this.people != null) {
            this.people.forEach(i -> i.setDepartment(null));
        }
        if (people != null) {
            people.forEach(i -> i.setDepartment(this));
        }
        this.people = people;
    }

    public Department people(Set<Person> people) {
        this.setPeople(people);
        return this;
    }

    public Department addPerson(Person person) {
        this.people.add(person);
        person.setDepartment(this);
        return this;
    }

    public Department removePerson(Person person) {
        this.people.remove(person);
        person.setDepartment(null);
        return this;
    }

    public Department getParentDept() {
        return this.parentDept;
    }

    public void setParentDept(Department department) {
        this.parentDept = department;
    }

    public Department parentDept(Department department) {
        this.setParentDept(department);
        return this;
    }

    public Company getCompany() {
        return this.company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public Department company(Company company) {
        this.setCompany(company);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Department)) {
            return false;
        }
        return id != null && id.equals(((Department) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Department{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", email='" + getEmail() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
