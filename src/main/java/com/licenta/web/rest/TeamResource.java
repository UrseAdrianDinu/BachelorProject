package com.licenta.web.rest;

import com.licenta.repository.TeamRepository;
import com.licenta.service.TeamService;
import com.licenta.service.dto.*;
import com.licenta.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.licenta.domain.Team}.
 */
@RestController
@RequestMapping("/api")
public class TeamResource {

    private final Logger log = LoggerFactory.getLogger(TeamResource.class);

    private static final String ENTITY_NAME = "team";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeamService teamService;

    private final TeamRepository teamRepository;

    public TeamResource(TeamService teamService, TeamRepository teamRepository) {
        this.teamService = teamService;
        this.teamRepository = teamRepository;
    }

    /**
     * {@code POST  /teams} : Create a new team.
     *
     * @param teamDTO the teamDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teamDTO, or with status {@code 400 (Bad Request)} if the team has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/teams")
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) throws URISyntaxException {
        log.debug("REST request to save Team : {}", teamDTO);
        if (teamDTO.getId() != null) {
            throw new BadRequestAlertException("A new team cannot already have an ID", ENTITY_NAME, "idexists");
        }
        TeamDTO result = teamService.save(teamDTO);
        return ResponseEntity
            .created(new URI("/api/teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/teams/project/{id}")
    public ResponseEntity<TeamDTO> createProjectPhase(@PathVariable final Long id, @Valid @RequestBody TeamCreateDTO teamCreateDTO)
        throws URISyntaxException {
        log.debug("REST request to save Team : {}", teamCreateDTO);

        TeamDTO result = teamService.saveTeamAndProject(teamCreateDTO, id);
        return ResponseEntity
            .created(new URI("/api/teams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /teams/:id} : Updates an existing team.
     *
     * @param id the id of the teamDTO to save.
     * @param teamDTO the teamDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teamDTO,
     * or with status {@code 400 (Bad Request)} if the teamDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teamDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/teams/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable(value = "id", required = false) final Long id, @RequestBody TeamDTO teamDTO)
        throws URISyntaxException {
        log.debug("REST request to update Team : {}, {}", id, teamDTO);
        if (teamDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teamDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        TeamDTO result = teamService.update(teamDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, teamDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /teams/:id} : Partial updates given fields of an existing team, field will ignore if it is null
     *
     * @param id the id of the teamDTO to save.
     * @param teamDTO the teamDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teamDTO,
     * or with status {@code 400 (Bad Request)} if the teamDTO is not valid,
     * or with status {@code 404 (Not Found)} if the teamDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the teamDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/teams/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TeamDTO> partialUpdateTeam(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody TeamDTO teamDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Team partially : {}, {}", id, teamDTO);
        if (teamDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teamDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teamRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TeamDTO> result = teamService.partialUpdate(teamDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, teamDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /teams} : get all the teams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teams in body.
     */
    @GetMapping("/teams")
    public List<TeamDTO> getAllTeams() {
        log.debug("REST request to get all Teams");
        return teamService.findAll();
    }

    /**
     * {@code GET  /teams/:id} : get the "id" team.
     *
     * @param id the id of the teamDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teamDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/teams/{id}")
    public ResponseEntity<TeamDTO> getTeam(@PathVariable Long id) {
        log.debug("REST request to get Team : {}", id);
        Optional<TeamDTO> teamDTO = teamService.findOne(id);
        return ResponseUtil.wrapOrNotFound(teamDTO);
    }

    @GetMapping("/teams/{id}/people")
    public List<PersonUserRoleDTO> getTeamPeople(@PathVariable Long id) {
        log.debug("REST request to get Project Phases : {}", id);
        return teamService.findTeamPeople(id);
    }

    /**
     * {@code DELETE  /teams/:id} : delete the "id" team.
     *
     * @param id the id of the teamDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/teams/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long id) {
        log.debug("REST request to delete Team : {}", id);
        teamService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
