package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Company.
 */
@Entity
@Table(name = "company")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Company implements Serializable {

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
    @Column(name = "crn", nullable = false)
    private String crn;

    @Column(name = "description")
    private String description;

    @Column(name = "email")
    private String email;

    @Column(name = "street_adress")
    private String streetAdress;

    @Column(name = "city")
    private String city;

    @Column(name = "country")
    private String country;

    @Column(name = "ceo_name")
    private String ceoName;

    @OneToMany(mappedBy = "company")
    @JsonIgnoreProperties(value = { "people", "parentDept", "company" }, allowSetters = true)
    private Set<Department> departments = new HashSet<>();

    @OneToMany(mappedBy = "company")
    @JsonIgnoreProperties(value = { "tasks", "phases", "teams", "company" }, allowSetters = true)
    private Set<Project> projects = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Company id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Company name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCrn() {
        return this.crn;
    }

    public Company crn(String crn) {
        this.setCrn(crn);
        return this;
    }

    public void setCrn(String crn) {
        this.crn = crn;
    }

    public String getDescription() {
        return this.description;
    }

    public Company description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmail() {
        return this.email;
    }

    public Company email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStreetAdress() {
        return this.streetAdress;
    }

    public Company streetAdress(String streetAdress) {
        this.setStreetAdress(streetAdress);
        return this;
    }

    public void setStreetAdress(String streetAdress) {
        this.streetAdress = streetAdress;
    }

    public String getCity() {
        return this.city;
    }

    public Company city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return this.country;
    }

    public Company country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getCeoName() {
        return this.ceoName;
    }

    public Company ceoName(String ceoName) {
        this.setCeoName(ceoName);
        return this;
    }

    public void setCeoName(String ceoName) {
        this.ceoName = ceoName;
    }

    public Set<Department> getDepartments() {
        return this.departments;
    }

    public void setDepartments(Set<Department> departments) {
        if (this.departments != null) {
            this.departments.forEach(i -> i.setCompany(null));
        }
        if (departments != null) {
            departments.forEach(i -> i.setCompany(this));
        }
        this.departments = departments;
    }

    public Company departments(Set<Department> departments) {
        this.setDepartments(departments);
        return this;
    }

    public Company addDepartment(Department department) {
        this.departments.add(department);
        department.setCompany(this);
        return this;
    }

    public Company removeDepartment(Department department) {
        this.departments.remove(department);
        department.setCompany(null);
        return this;
    }

    public Set<Project> getProjects() {
        return this.projects;
    }

    public void setProjects(Set<Project> projects) {
        if (this.projects != null) {
            this.projects.forEach(i -> i.setCompany(null));
        }
        if (projects != null) {
            projects.forEach(i -> i.setCompany(this));
        }
        this.projects = projects;
    }

    public Company projects(Set<Project> projects) {
        this.setProjects(projects);
        return this;
    }

    public Company addProject(Project project) {
        this.projects.add(project);
        project.setCompany(this);
        return this;
    }

    public Company removeProject(Project project) {
        this.projects.remove(project);
        project.setCompany(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Company)) {
            return false;
        }
        return id != null && id.equals(((Company) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Company{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", crn='" + getCrn() + "'" +
            ", description='" + getDescription() + "'" +
            ", email='" + getEmail() + "'" +
            ", streetAdress='" + getStreetAdress() + "'" +
            ", city='" + getCity() + "'" +
            ", country='" + getCountry() + "'" +
            ", ceoName='" + getCeoName() + "'" +
            "}";
    }
}
