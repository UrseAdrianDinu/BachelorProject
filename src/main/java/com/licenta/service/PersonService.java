package com.licenta.service;

import com.licenta.domain.*;
import com.licenta.domain.enumeration.PhaseStatus;
import com.licenta.repository.CompanyRepository;
import com.licenta.repository.DepartmentRepository;
import com.licenta.repository.PersonRepository;
import com.licenta.repository.TeamRepository;
import com.licenta.service.dto.*;
import com.licenta.service.mapper.CompanyMapper;
import com.licenta.service.mapper.DepartmentMapper;
import com.licenta.service.mapper.PersonMapper;
import com.licenta.service.mapper.RoleMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Person}.
 */
@Service
@Transactional
public class PersonService {

    private final Logger log = LoggerFactory.getLogger(PersonService.class);

    private final PersonRepository personRepository;

    private final DepartmentRepository departmentRepository;

    private final CompanyRepository companyRepository;

    private final TeamRepository teamRepository;

    private final PersonMapper personMapper;
    private final RoleMapper roleMapper;
    private final DepartmentMapper departmentMapper;
    private final CompanyMapper companyMapper;

    public PersonService(
        PersonRepository personRepository,
        DepartmentRepository departmentRepository,
        CompanyRepository companyRepository,
        TeamRepository teamRepository,
        PersonMapper personMapper,
        RoleMapper roleMapper,
        DepartmentMapper departmentMapper,
        CompanyMapper companyMapper
    ) {
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.personRepository = personRepository;
        this.teamRepository = teamRepository;
        this.personMapper = personMapper;
        this.roleMapper = roleMapper;
        this.departmentMapper = departmentMapper;
        this.companyMapper = companyMapper;
    }

    /**
     * Save a person.
     *
     * @param personDTO the entity to save.
     * @return the persisted entity.
     */
    public PersonDTO save(PersonDTO personDTO) {
        log.debug("Request to save Person : {}", personDTO);
        Person person = personMapper.toEntity(personDTO);
        person = personRepository.save(person);
        return personMapper.toDto(person);
    }

    /**
     * Update a person.
     *
     * @param personDTO the entity to save.
     * @return the persisted entity.
     */
    public PersonDTO update(PersonDTO personDTO) {
        log.debug("Request to update Person : {}", personDTO);
        Person person = personMapper.toEntity(personDTO);
        person = personRepository.save(person);
        return personMapper.toDto(person);
    }

    /**
     * Partially update a person.
     *
     * @param personDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PersonDTO> partialUpdate(PersonDTO personDTO) {
        log.debug("Request to partially update Person : {}", personDTO);

        return personRepository
            .findById(personDTO.getId())
            .map(existingPerson -> {
                personMapper.partialUpdate(existingPerson, personDTO);

                return existingPerson;
            })
            .map(personRepository::save)
            .map(personMapper::toDto);
    }

    /**
     * Get all the people.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PersonDTO> findAll() {
        log.debug("Request to get all People");
        return personRepository.findAll().stream().map(personMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the people with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<PersonDTO> findAllWithEagerRelationships(Pageable pageable) {
        return personRepository.findAllWithEagerRelationships(pageable).map(personMapper::toDto);
    }

    /**
     * Get one person by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PersonDTO> findOne(Long id) {
        log.debug("Request to get Person : {}", id);
        return personRepository.findOneWithEagerRelationships(id).map(personMapper::toDto);
    }

    public Optional<RoleDTO> getPersonRole(long id) {
        log.debug("Request to get Person with id {} roles", id);
        Optional<Person> person = personRepository.findById(id);
        return person.map(value -> roleMapper.toDto(value.getRole()));
    }

    public Optional<DepartmentDTO> getPersonDepartment(long id) {
        log.debug("Request to get Person with id {} roles", id);
        Optional<Person> person = personRepository.findById(id);
        return person.map(value -> departmentMapper.toDto(value.getDepartment()));
    }

    public Optional<CompanyDTO> getPersonCompany(long id) {
        log.debug("Request to get Person with id {} roles", id);
        Optional<Person> person = personRepository.findById(id);
        Optional<Department> department = person.map(Person::getDepartment);
        Optional<Company> company = department.map(Department::getCompany);
        return company.map(companyMapper::toDto);
    }

    public PersonDTO setPersonTeam(Long personId, Long teamId) {
        log.debug("Request to set Person team: {}", personId);
        Optional<Person> optionalPerson = personRepository.findById(personId);
        Optional<Team> optionalTeam = teamRepository.findById(teamId);
        if (optionalPerson.isPresent() && optionalTeam.isPresent()) {
            Person person = optionalPerson.get();
            Team team = optionalTeam.get();
            person = person.addTeam(team);
            team = team.addPerson(person);
            person = personRepository.save(person);
            team = teamRepository.save(team);
            return personMapper.toDto(person);
        } else {
            return null;
        }
    }

    /**
     * Delete the person by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Person : {}", id);
        personRepository.deleteById(id);
    }

    public Optional<PersonDTO> getPersonByUser(Long user_id) {
        return personRepository.findByUserId(user_id).map(personMapper::toDto);
    }
}
