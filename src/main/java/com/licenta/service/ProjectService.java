package com.licenta.service;

import com.licenta.domain.*;
import com.licenta.domain.enumeration.ProjectStatus;
import com.licenta.repository.CompanyRepository;
import com.licenta.repository.ProjectRepository;
import com.licenta.service.dto.*;
import com.licenta.service.mapper.*;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Project}.
 */
@Service
@Transactional
public class ProjectService {

    private final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final ProjectRepository projectRepository;

    private final CompanyRepository companyRepository;
    private final ProjectMapper projectMapper;
    private final PhaseMapper phaseMapper;
    private final TeamMapper teamMapper;
    private final UserMapper userMapper;
    private final PersonMapper personMapper;

    public ProjectService(
        ProjectRepository projectRepository,
        CompanyRepository companyRepository,
        ProjectMapper projectMapper,
        PhaseMapper phaseMapper,
        TeamMapper teamMapper,
        UserMapper userMapper,
        PersonMapper personMapper
    ) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
        this.companyRepository = companyRepository;
        this.phaseMapper = phaseMapper;
        this.teamMapper = teamMapper;
        this.userMapper = userMapper;
        this.personMapper = personMapper;
    }

    /**
     * Save a project.
     *
     * @param projectDTO the entity to save.
     * @return the persisted entity.
     */
    public ProjectDTO save(ProjectDTO projectDTO) {
        log.debug("Request to save Project : {}", projectDTO);
        Project project = projectMapper.toEntity(projectDTO);
        project = projectRepository.save(project);
        return projectMapper.toDto(project);
    }

    public ProjectDTO saveProjectAndAddCompany(ProjectCreateDTO projectCreateDTO, Long id) {
        log.debug("Request to save Project : {}", projectCreateDTO);
        Project project = new Project();
        project.setName(projectCreateDTO.getName());
        project.setCode(projectCreateDTO.getCode());
        project.setDomain(projectCreateDTO.getDomain());
        project.setDescription(projectCreateDTO.getDescription());
        project.setStartDate(projectCreateDTO.getStartDate());
        project.setBillable(projectCreateDTO.getBillable());
        project.setStatus(ProjectStatus.ACTIVE);

        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            project.setCompany(company);
        }
        project = projectRepository.save(project);
        return projectMapper.toDto(project);
    }

    public List<PersonUserDTO> findProjectPeople(Long id) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        List<PersonUserDTO> personUserDTOS = new LinkedList<>();
        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();
            Set<Team> teans = project.getTeams();
            for (Team team : teans) {
                for (Person person : team.getPeople()) {
                    AdminUserDTO adminUserDTO = this.userMapper.userToAdminUserDTO(person.getUser());
                    PersonDTO personDTO = this.personMapper.toDto(person);
                    PersonUserDTO personUserDTO = new PersonUserDTO(adminUserDTO, personDTO);
                    if (!personUserDTOS.contains(personUserDTO)) personUserDTOS.add(personUserDTO);
                }
            }
        }
        return personUserDTOS;
    }

    /**
     * Update a project.
     *
     * @param projectDTO the entity to save.
     * @return the persisted entity.
     */
    public ProjectDTO update(ProjectDTO projectDTO) {
        log.debug("Request to update Project : {}", projectDTO);
        Project project = projectMapper.toEntity(projectDTO);
        project = projectRepository.save(project);
        return projectMapper.toDto(project);
    }

    /**
     * Partially update a project.
     *
     * @param projectDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProjectDTO> partialUpdate(ProjectDTO projectDTO) {
        log.debug("Request to partially update Project : {}", projectDTO);

        return projectRepository
            .findById(projectDTO.getId())
            .map(existingProject -> {
                projectMapper.partialUpdate(existingProject, projectDTO);

                return existingProject;
            })
            .map(projectRepository::save)
            .map(projectMapper::toDto);
    }

    /**
     * Get all the projects.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ProjectDTO> findAll() {
        log.debug("Request to get all Projects");
        return projectRepository.findAll().stream().map(projectMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    @Transactional(readOnly = true)
    public List<PhaseDTO> findProjectPhases(Long id) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        return projectOptional.map(value -> value.getPhases().stream().map(phaseMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<TeamDTO> findProjectTeams(Long id) {
        Optional<Project> projectOptional = projectRepository.findById(id);
        return projectOptional.map(value -> value.getTeams().stream().map(teamMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    /**
     * Get all the projects with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ProjectDTO> findAllWithEagerRelationships(Pageable pageable) {
        return projectRepository.findAllWithEagerRelationships(pageable).map(projectMapper::toDto);
    }

    /**
     * Get one project by id.
     *e
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ProjectDTO> findOne(Long id) {
        log.debug("Request to get Project : {}", id);
        return projectRepository.findOneWithEagerRelationships(id).map(projectMapper::toDto);
    }

    /**
     * Delete the project by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Project : {}", id);
        projectRepository.deleteById(id);
    }
}
