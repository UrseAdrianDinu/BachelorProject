package com.licenta.web.rest;

import com.licenta.repository.SprintRepository;
import com.licenta.service.SprintService;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.dto.RiskDTO;
import com.licenta.service.dto.SprintDTO;
import com.licenta.service.dto.TaskDTO;
import com.licenta.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.licenta.domain.Sprint}.
 */
@RestController
@RequestMapping("/api")
public class SprintResource {

    private final Logger log = LoggerFactory.getLogger(SprintResource.class);

    private static final String ENTITY_NAME = "sprint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SprintService sprintService;

    private final SprintRepository sprintRepository;

    public SprintResource(SprintService sprintService, SprintRepository sprintRepository) {
        this.sprintService = sprintService;
        this.sprintRepository = sprintRepository;
    }

    /**
     * {@code POST  /sprints} : Create a new sprint.
     *
     * @param sprintDTO the sprintDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sprintDTO, or with status {@code 400 (Bad Request)} if the sprint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sprints")
    public ResponseEntity<SprintDTO> createSprint(@RequestBody SprintDTO sprintDTO) throws URISyntaxException {
        log.debug("REST request to save Sprint : {}", sprintDTO);
        if (sprintDTO.getId() != null) {
            throw new BadRequestAlertException("A new sprint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        SprintDTO result = sprintService.save(sprintDTO);
        return ResponseEntity
            .created(new URI("/api/sprints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/sprints/phase/{id}")
    public ResponseEntity<SprintDTO> createRiskPhase(@PathVariable final Long id, @RequestBody SprintDTO sprintDTO)
        throws URISyntaxException {
        log.debug("REST request to save Sprint : {}", sprintDTO);

        SprintDTO result = sprintService.saveSprintAndPhase(sprintDTO, id);
        return ResponseEntity
            .created(new URI("/api/sprints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sprints/:id} : Updates an existing sprint.
     *
     * @param id the id of the sprintDTO to save.
     * @param sprintDTO the sprintDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sprintDTO,
     * or with status {@code 400 (Bad Request)} if the sprintDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sprintDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sprints/{id}")
    public ResponseEntity<SprintDTO> updateSprint(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SprintDTO sprintDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Sprint : {}, {}", id, sprintDTO);
        if (sprintDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sprintDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sprintRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        SprintDTO result = sprintService.update(sprintDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sprintDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sprints/:id} : Partial updates given fields of an existing sprint, field will ignore if it is null
     *
     * @param id the id of the sprintDTO to save.
     * @param sprintDTO the sprintDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sprintDTO,
     * or with status {@code 400 (Bad Request)} if the sprintDTO is not valid,
     * or with status {@code 404 (Not Found)} if the sprintDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the sprintDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sprints/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SprintDTO> partialUpdateSprint(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SprintDTO sprintDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sprint partially : {}, {}", id, sprintDTO);
        if (sprintDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sprintDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sprintRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SprintDTO> result = sprintService.partialUpdate(sprintDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, sprintDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /sprints} : get all the sprints.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sprints in body.
     */
    @GetMapping("/sprints")
    public List<SprintDTO> getAllSprints() {
        log.debug("REST request to get all Sprints");
        return sprintService.findAll();
    }

    /**
     * {@code GET  /sprints/:id} : get the "id" sprint.
     *
     * @param id the id of the sprintDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sprintDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sprints/{id}")
    public ResponseEntity<SprintDTO> getSprint(@PathVariable Long id) {
        log.debug("REST request to get Sprint : {}", id);
        Optional<SprintDTO> sprintDTO = sprintService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sprintDTO);
    }

    @GetMapping("/sprints/{id}/tasks")
    public List<TaskDTO> getSprintTasks(@PathVariable Long id) {
        log.debug("REST request to get Project Phases : {}", id);
        return sprintService.findSprintTasks(id);
    }

    /**
     * {@code DELETE  /sprints/:id} : delete the "id" sprint.
     *
     * @param id the id of the sprintDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sprints/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        log.debug("REST request to delete Sprint : {}", id);
        sprintService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
