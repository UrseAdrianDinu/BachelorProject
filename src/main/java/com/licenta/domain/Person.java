package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.PersonStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Person.
 */
@Entity
@Table(name = "person")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Person implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "salary")
    private Long salary;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private PersonStatus status;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(name = "street_address")
    private String streetAddress;

    @Column(name = "postal_code")
    private String postalCode;

    @Column(name = "city")
    private String city;

    @Column(name = "region")
    private String region;

    @Column(name = "country")
    private String country;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "person")
    @JsonIgnoreProperties(value = { "person", "project", "sprint", "team" }, allowSetters = true)
    private Set<Task> tasks = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "tasks", "manager", "teams", "department", "role" }, allowSetters = true)
    private Person manager;

    @ManyToMany
    @JoinTable(name = "rel_person__team", joinColumns = @JoinColumn(name = "person_id"), inverseJoinColumns = @JoinColumn(name = "team_id"))
    @JsonIgnoreProperties(value = { "tasks", "people", "projects" }, allowSetters = true)
    private Set<Team> teams = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "people", "parentDept", "company" }, allowSetters = true)
    private Department department;

    @ManyToOne
    @JsonIgnoreProperties(value = { "people" }, allowSetters = true)
    private Role role;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Person id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Person code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPhoneNumber() {
        return this.phoneNumber;
    }

    public Person phoneNumber(String phoneNumber) {
        this.setPhoneNumber(phoneNumber);
        return this;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getSalary() {
        return this.salary;
    }

    public Person salary(Long salary) {
        this.setSalary(salary);
        return this;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public PersonStatus getStatus() {
        return this.status;
    }

    public Person status(PersonStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(PersonStatus status) {
        this.status = status;
    }

    public LocalDate getHireDate() {
        return this.hireDate;
    }

    public Person hireDate(LocalDate hireDate) {
        this.setHireDate(hireDate);
        return this;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public LocalDate getDateOfBirth() {
        return this.dateOfBirth;
    }

    public Person dateOfBirth(LocalDate dateOfBirth) {
        this.setDateOfBirth(dateOfBirth);
        return this;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getStreetAddress() {
        return this.streetAddress;
    }

    public Person streetAddress(String streetAddress) {
        this.setStreetAddress(streetAddress);
        return this;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getPostalCode() {
        return this.postalCode;
    }

    public Person postalCode(String postalCode) {
        this.setPostalCode(postalCode);
        return this;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return this.city;
    }

    public Person city(String city) {
        this.setCity(city);
        return this;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return this.region;
    }

    public Person region(String region) {
        this.setRegion(region);
        return this;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return this.country;
    }

    public Person country(String country) {
        this.setCountry(country);
        return this;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Person user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Task> getTasks() {
        return this.tasks;
    }

    public void setTasks(Set<Task> tasks) {
        if (this.tasks != null) {
            this.tasks.forEach(i -> i.setPerson(null));
        }
        if (tasks != null) {
            tasks.forEach(i -> i.setPerson(this));
        }
        this.tasks = tasks;
    }

    public Person tasks(Set<Task> tasks) {
        this.setTasks(tasks);
        return this;
    }

    public Person addTask(Task task) {
        this.tasks.add(task);
        task.setPerson(this);
        return this;
    }

    public Person removeTask(Task task) {
        this.tasks.remove(task);
        task.setPerson(null);
        return this;
    }

    public Person getManager() {
        return this.manager;
    }

    public void setManager(Person person) {
        this.manager = person;
    }

    public Person manager(Person person) {
        this.setManager(person);
        return this;
    }

    public Set<Team> getTeams() {
        return this.teams;
    }

    public void setTeams(Set<Team> teams) {
        this.teams = teams;
    }

    public Person teams(Set<Team> teams) {
        this.setTeams(teams);
        return this;
    }

    public Person addTeam(Team team) {
        this.teams.add(team);
        team.getPeople().add(this);
        return this;
    }

    public Person removeTeam(Team team) {
        this.teams.remove(team);
        team.getPeople().remove(this);
        return this;
    }

    public Department getDepartment() {
        return this.department;
    }

    public void setDepartment(Department department) {
        this.department = department;
    }

    public Person department(Department department) {
        this.setDepartment(department);
        return this;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Person role(Role role) {
        this.setRole(role);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Person)) {
            return false;
        }
        return id != null && id.equals(((Person) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Person{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", phoneNumber='" + getPhoneNumber() + "'" +
            ", salary=" + getSalary() +
            ", status='" + getStatus() + "'" +
            ", hireDate='" + getHireDate() + "'" +
            ", dateOfBirth='" + getDateOfBirth() + "'" +
            ", streetAddress='" + getStreetAddress() + "'" +
            ", postalCode='" + getPostalCode() + "'" +
            ", city='" + getCity() + "'" +
            ", region='" + getRegion() + "'" +
            ", country='" + getCountry() + "'" +
            "}";
    }
}
