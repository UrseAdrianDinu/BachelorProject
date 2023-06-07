package com.licenta.service;

import com.licenta.domain.Person;
import com.licenta.domain.Phase;
import com.licenta.domain.Project;
import com.licenta.domain.Team;
import com.licenta.repository.ProjectRepository;
import com.licenta.repository.TeamRepository;
import com.licenta.service.dto.*;
import com.licenta.service.mapper.PersonMapper;
import com.licenta.service.mapper.RoleMapper;
import com.licenta.service.mapper.TeamMapper;
import com.licenta.service.mapper.UserMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Team}.
 */
@Service
@Transactional
public class TeamService {

    private final Logger log = LoggerFactory.getLogger(TeamService.class);

    private final TeamRepository teamRepository;

    private final ProjectRepository projectRepository;
    private final TeamMapper teamMapper;
    private final PersonMapper personMapper;
    private final UserMapper userMapper;

    private final RoleMapper roleMapper;

    public TeamService(
        TeamRepository teamRepository,
        ProjectRepository projectRepository,
        TeamMapper teamMapper,
        UserMapper userMapper,
        PersonMapper peopleMapper,
        RoleMapper roleMapper
    ) {
        this.teamRepository = teamRepository;
        this.teamMapper = teamMapper;
        this.personMapper = peopleMapper;
        this.userMapper = userMapper;
        this.roleMapper = roleMapper;
        this.projectRepository = projectRepository;
    }

    /**
     * Save a team.
     *
     * @param teamDTO the entity to save.
     * @return the persisted entity.
     */
    public TeamDTO save(TeamDTO teamDTO) {
        log.debug("Request to save Team : {}", teamDTO);
        Team team = teamMapper.toEntity(teamDTO);
        team = teamRepository.save(team);
        return teamMapper.toDto(team);
    }

    public TeamDTO saveTeamAndProject(TeamCreateDTO teamCreateDTO, Long id) {
        log.debug("Request to save Project Team: {}", teamCreateDTO);
        Team team = new Team();
        team.setName(teamCreateDTO.getName());
        team.setEmail(teamCreateDTO.getEmail());

        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            team.addProject(project);
        }
        team = teamRepository.save(team);
        return teamMapper.toDto(team);
    }

    /**
     * Update a team.
     *
     * @param teamDTO the entity to save.
     * @return the persisted entity.
     */
    public TeamDTO update(TeamDTO teamDTO) {
        log.debug("Request to update Team : {}", teamDTO);
        Team team = teamMapper.toEntity(teamDTO);
        team = teamRepository.save(team);
        return teamMapper.toDto(team);
    }

    /**
     * Partially update a team.
     *
     * @param teamDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TeamDTO> partialUpdate(TeamDTO teamDTO) {
        log.debug("Request to partially update Team : {}", teamDTO);

        return teamRepository
            .findById(teamDTO.getId())
            .map(existingTeam -> {
                teamMapper.partialUpdate(existingTeam, teamDTO);

                return existingTeam;
            })
            .map(teamRepository::save)
            .map(teamMapper::toDto);
    }

    /**
     * Get all the teams.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TeamDTO> findAll() {
        log.debug("Request to get all Teams");
        return teamRepository.findAll().stream().map(teamMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one team by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TeamDTO> findOne(Long id) {
        log.debug("Request to get Team : {}", id);
        return teamRepository.findById(id).map(teamMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<PersonUserRoleDTO> findTeamPeople(Long id) {
        Optional<Team> teamOptional = teamRepository.findById(id);
        List<PersonUserRoleDTO> personUserDTOS = new LinkedList<>();
        if (teamOptional.isPresent()) {
            Team team = teamOptional.get();
            for (Person person : team.getPeople()) {
                personUserDTOS.add(
                    new PersonUserRoleDTO(
                        userMapper.userToAdminUserDTO(person.getUser()),
                        personMapper.toDto(person),
                        roleMapper.toDto(person.getRole())
                    )
                );
            }
        }
        return personUserDTOS;
    }

    /**
     * Delete the team by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Team : {}", id);
        teamRepository.deleteById(id);
    }
}
