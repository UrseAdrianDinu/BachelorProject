package com.licenta.service;

import com.licenta.domain.Company;
import com.licenta.domain.Department;
import com.licenta.domain.Person;
import com.licenta.domain.Role;
import com.licenta.domain.enumeration.RoleSeniority;
import com.licenta.repository.CompanyRepository;
import com.licenta.repository.DepartmentRepository;
import com.licenta.repository.PersonRepository;
import com.licenta.repository.RoleRepository;
import com.licenta.service.dto.*;
import com.licenta.service.mapper.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Company}.
 */
@Service
@Transactional
public class CompanyService {

    private final Logger log = LoggerFactory.getLogger(CompanyService.class);
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final RoleRepository roleRepository;
    private final PersonRepository personRepository;
    private final CompanyMapper companyMapper;
    private final RoleMapper roleMapper;
    private final DepartmentMapper departmentMapper;
    private final PersonMapper personMapper;
    private final ProjectMapper projectMapper;

    private final UserMapper userMapper;

    public CompanyService(
        CompanyRepository companyRepository,
        DepartmentRepository departmentRepository,
        RoleRepository roleRepository,
        PersonRepository personRepository,
        CompanyMapper companyMapper,
        RoleMapper roleMapper,
        DepartmentMapper departmentMapper,
        ProjectMapper projectMapper,
        PersonMapper personMapper,
        UserMapper userMapper
    ) {
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.roleRepository = roleRepository;
        this.personRepository = personRepository;
        this.companyMapper = companyMapper;
        this.roleMapper = roleMapper;
        this.departmentMapper = departmentMapper;
        this.projectMapper = projectMapper;
        this.personMapper = personMapper;
        this.userMapper = userMapper;
    }

    /**
     * Save a company.
     *
     * @param companyDTO the entity to save.
     * @return the persisted entity.
     */
    public CompanyDTO save(CompanyDTO companyDTO) {
        log.debug("Request to save Company : {}", companyDTO);
        Company company = companyMapper.toEntity(companyDTO);
        company = companyRepository.save(company);
        return companyMapper.toDto(company);
    }

    /**
     * Save a company.
     *
     * @param companyDTO the entity to save.
     * @return the persisted entity.
     */
    public CompanyDTO createCompanyAndAddRole(CompanyDTO companyDTO, RoleDTO roleDTO, long id) {
        log.debug("Request to save Company and Role : {}", companyDTO);
        Company company = companyMapper.toEntity(companyDTO);
        company = companyRepository.save(company);
        Department department = new Department();
        department.setCompany(company);
        department.setName("Management");
        department.setCode("MAN");
        department.setDescription("Management Department");
        department.setEmail("management@gmail.com");
        department = departmentRepository.save(department);
        String name = roleDTO.getName();
        String code = roleDTO.getCode();
        RoleSeniority seniority = roleDTO.getSeniority();
        Role role = roleRepository.findByNameAndCodeAndSeniority(name, code, seniority);
        if (role == null) {
            role = new Role();
            role.setName(name);
            role.setCode(code);
            role.setSeniority(seniority);
            role = roleRepository.save(role);
        }
        Optional<Person> optionalPerson = personRepository.findById(id);

        if (optionalPerson.isPresent()) {
            Person person = optionalPerson.get();
            person.setRole(role);
            person.setDepartment(department);
            personRepository.save(person);
        }
        return companyMapper.toDto(company);
    }

    /**
     * Update a company.
     *
     * @param companyDTO the entity to save.
     * @return the persisted entity.
     */
    public CompanyDTO update(CompanyDTO companyDTO) {
        log.debug("Request to update Company : {}", companyDTO);
        Company company = companyMapper.toEntity(companyDTO);
        company = companyRepository.save(company);
        return companyMapper.toDto(company);
    }

    /**
     * Partially update a company.
     *
     * @param companyDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<CompanyDTO> partialUpdate(CompanyDTO companyDTO) {
        log.debug("Request to partially update Company : {}", companyDTO);

        return companyRepository
            .findById(companyDTO.getId())
            .map(existingCompany -> {
                companyMapper.partialUpdate(existingCompany, companyDTO);

                return existingCompany;
            })
            .map(companyRepository::save)
            .map(companyMapper::toDto);
    }

    /**
     * Get all the companies.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<CompanyDTO> findAll() {
        log.debug("Request to get all Companies");
        return companyRepository.findAll().stream().map(companyMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    public List<DepartmentDTO> findCompanyDepartments(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        return company.map(value -> value.getDepartments().stream().map(departmentMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    public List<ProjectDTO> findCompanyProjects(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        return company.map(value -> value.getProjects().stream().map(projectMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    public List<String> findCompanyDepartmentNames(Long id) {
        Optional<Company> company = companyRepository.findById(id);
        if (company.isPresent()) {
            Set<Department> departments = company.get().getDepartments();
            return departments.stream().map(Department::getName).collect(Collectors.toList());
        } else {
            return null;
        }
    }

    public List<PersonDTO> findCompanyPersons(Long id) {
        Optional<Company> companyOptional = companyRepository.findById(id);
        List<Person> persons = new LinkedList<>();
        if (companyOptional.isPresent()) {
            persons = new LinkedList<>();
            Company company = companyOptional.get();
            Set<Department> departments = company.getDepartments();
            for (Department department : departments) {
                persons.addAll(department.getPeople());
            }
        }
        return persons.stream().map(personMapper::toDto).collect(Collectors.toList());
    }

    public List<PersonUserDTO> findCompanyPersonUsers(Long id) {
        Optional<Company> companyOptional = companyRepository.findById(id);
        List<Person> persons = new LinkedList<>();
        List<PersonUserDTO> personUserDTOS = new LinkedList<>();
        if (companyOptional.isPresent()) {
            persons = new LinkedList<>();
            Company company = companyOptional.get();
            Set<Department> departments = company.getDepartments();
            for (Department department : departments) {
                for (Person person : department.getPeople()) {
                    AdminUserDTO adminUserDTO = this.userMapper.userToAdminUserDTO(person.getUser());
                    PersonDTO personUserDTO = this.personMapper.toDto(person);
                    personUserDTOS.add(new PersonUserDTO(adminUserDTO, personUserDTO));
                }
            }
        }
        return personUserDTOS;
    }

    /**
     * Get one company by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<CompanyDTO> findOne(Long id) {
        log.debug("Request to get Company : {}", id);
        return companyRepository.findById(id).map(companyMapper::toDto);
    }

    /**
     * Delete the company by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Company : {}", id);
        companyRepository.deleteById(id);
    }
}
