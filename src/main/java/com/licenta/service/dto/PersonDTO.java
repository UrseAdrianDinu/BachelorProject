package com.licenta.service.dto;

import com.licenta.domain.enumeration.PersonStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.licenta.domain.Person} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PersonDTO implements Serializable {

    private Long id;

    private String code;

    private String phoneNumber;

    private Long salary;

    private PersonStatus status;

    private LocalDate hireDate;

    private LocalDate dateOfBirth;

    private String streetAddress;

    private String postalCode;

    private String city;

    private String region;

    private String country;

    private UserDTO user;

    private PersonDTO manager;

    private Set<TeamDTO> teams = new HashSet<>();

    private DepartmentDTO department;

    private RoleDTO role;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Long getSalary() {
        return salary;
    }

    public void setSalary(Long salary) {
        this.salary = salary;
    }

    public PersonStatus getStatus() {
        return status;
    }

    public void setStatus(PersonStatus status) {
        this.status = status;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public PersonDTO getManager() {
        return manager;
    }

    public void setManager(PersonDTO manager) {
        this.manager = manager;
    }

    public Set<TeamDTO> getTeams() {
        return teams;
    }

    public void setTeams(Set<TeamDTO> teams) {
        this.teams = teams;
    }

    public DepartmentDTO getDepartment() {
        return department;
    }

    public void setDepartment(DepartmentDTO department) {
        this.department = department;
    }

    public RoleDTO getRole() {
        return role;
    }

    public void setRole(RoleDTO role) {
        this.role = role;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PersonDTO)) {
            return false;
        }

        PersonDTO personDTO = (PersonDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, personDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PersonDTO{" +
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
            ", user=" + getUser() +
            ", manager=" + getManager() +
            ", teams=" + getTeams() +
            ", department=" + getDepartment() +
            ", role=" + getRole() +
            "}";
    }
}
