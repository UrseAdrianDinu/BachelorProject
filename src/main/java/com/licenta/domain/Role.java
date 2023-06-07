package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.RoleSeniority;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Role.
 */
@Entity
@Table(name = "role")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Role implements Serializable {

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

    @Enumerated(EnumType.STRING)
    @Column(name = "seniority")
    private RoleSeniority seniority;

    @OneToMany(mappedBy = "role")
    @JsonIgnoreProperties(value = { "user", "tasks", "manager", "teams", "department", "role" }, allowSetters = true)
    private Set<Person> people = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Role id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Role name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return this.code;
    }

    public Role code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public RoleSeniority getSeniority() {
        return this.seniority;
    }

    public Role seniority(RoleSeniority seniority) {
        this.setSeniority(seniority);
        return this;
    }

    public void setSeniority(RoleSeniority seniority) {
        this.seniority = seniority;
    }

    public Set<Person> getPeople() {
        return this.people;
    }

    public void setPeople(Set<Person> people) {
        if (this.people != null) {
            this.people.forEach(i -> i.setRole(null));
        }
        if (people != null) {
            people.forEach(i -> i.setRole(this));
        }
        this.people = people;
    }

    public Role people(Set<Person> people) {
        this.setPeople(people);
        return this;
    }

    public Role addPerson(Person person) {
        this.people.add(person);
        person.setRole(this);
        return this;
    }

    public Role removePerson(Person person) {
        this.people.remove(person);
        person.setRole(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Role)) {
            return false;
        }
        return id != null && id.equals(((Role) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Role{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", code='" + getCode() + "'" +
            ", seniority='" + getSeniority() + "'" +
            "}";
    }
}
