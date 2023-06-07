package com.licenta.web.rest;

import com.licenta.repository.PhaseRepository;
import com.licenta.service.PhaseService;
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
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.licenta.domain.Phase}.
 */
@RestController
@RequestMapping("/api")
public class PhaseResource {

    private final Logger log = LoggerFactory.getLogger(PhaseResource.class);

    private static final String ENTITY_NAME = "phase";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PhaseService phaseService;

    private final PhaseRepository phaseRepository;

    public PhaseResource(PhaseService phaseService, PhaseRepository phaseRepository) {
        this.phaseService = phaseService;
        this.phaseRepository = phaseRepository;
    }

    /**
     * {@code POST  /phases} : Create a new phase.
     *
     * @param phaseDTO the phaseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new phaseDTO, or with status {@code 400 (Bad Request)} if the phase has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/phases")
    public ResponseEntity<PhaseDTO> createPhase(@RequestBody PhaseDTO phaseDTO) throws URISyntaxException {
        log.debug("REST request to save Phase : {}", phaseDTO);
        if (phaseDTO.getId() != null) {
            throw new BadRequestAlertException("A new phase cannot already have an ID", ENTITY_NAME, "idexists");
        }
        PhaseDTO result = phaseService.save(phaseDTO);
        return ResponseEntity
            .created(new URI("/api/phases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/phases/project/{id}")
    public ResponseEntity<PhaseDTO> createProjectPhase(@PathVariable final Long id, @Valid @RequestBody PhaseCreateDTO phaseCreateDTO)
        throws URISyntaxException {
        log.debug("REST request to save Phase : {}", phaseCreateDTO);

        PhaseDTO result = phaseService.savePhaseAndProject(phaseCreateDTO, id);
        return ResponseEntity
            .created(new URI("/api/phases/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PutMapping("/phases/{id}/active")
    public ResponseEntity<PhaseDTO> setPhaseActive(@PathVariable(value = "id", required = false) final Long id) throws URISyntaxException {
        log.debug("REST request to save Phase : {}", id);

        PhaseDTO result = phaseService.setPhaseActive(id);
        String message = result.getName() + " is now active";
        HttpHeaders httpHeaders = HeaderUtil.createAlert(applicationName, message, result.getName());
        return ResponseEntity.created(new URI("/api/phases/" + result.getId())).headers(httpHeaders).body(result);
    }

    /**
     * {@code PUT  /phases/:id} : Updates an existing phase.
     *
     * @param id the id of the phaseDTO to save.
     * @param phaseDTO the phaseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phaseDTO,
     * or with status {@code 400 (Bad Request)} if the phaseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the phaseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/phases/{id}")
    public ResponseEntity<PhaseDTO> updatePhase(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhaseDTO phaseDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Phase : {}, {}", id, phaseDTO);
        if (phaseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phaseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phaseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        PhaseDTO result = phaseService.update(phaseDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phaseDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /phases/:id} : Partial updates given fields of an existing phase, field will ignore if it is null
     *
     * @param id the id of the phaseDTO to save.
     * @param phaseDTO the phaseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated phaseDTO,
     * or with status {@code 400 (Bad Request)} if the phaseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the phaseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the phaseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/phases/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<PhaseDTO> partialUpdatePhase(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody PhaseDTO phaseDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Phase partially : {}, {}", id, phaseDTO);
        if (phaseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, phaseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!phaseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<PhaseDTO> result = phaseService.partialUpdate(phaseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, phaseDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /phases} : get all the phases.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of phases in body.
     */
    @GetMapping("/phases")
    public List<PhaseDTO> getAllPhases() {
        log.debug("REST request to get all Phases");
        return phaseService.findAll();
    }

    /**
     * {@code GET  /phases/:id} : get the "id" phase.
     *
     * @param id the id of the phaseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the phaseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/phases/{id}")
    public ResponseEntity<PhaseDTO> getPhase(@PathVariable Long id) {
        log.debug("REST request to get Phase : {}", id);
        Optional<PhaseDTO> phaseDTO = phaseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(phaseDTO);
    }

    @GetMapping("/phases/{id}/risks")
    public List<RiskDTO> getPhaseRisks(@PathVariable Long id) {
        log.debug("REST request to get Project Phases : {}", id);
        return phaseService.findPhaseRisks(id);
    }

    @GetMapping("/phases/{id}/sprints")
    public List<SprintDTO> getPhaseSprints(@PathVariable Long id) {
        log.debug("REST request to get Project Phases : {}", id);
        return phaseService.findPhaseSprints(id);
    }

    /**
     * {@code DELETE  /phases/:id} : delete the "id" phase.
     *
     * @param id the id of the phaseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/phases/{id}")
    public ResponseEntity<Void> deletePhase(@PathVariable Long id) {
        log.debug("REST request to delete Phase : {}", id);
        phaseService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
