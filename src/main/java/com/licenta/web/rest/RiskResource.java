package com.licenta.web.rest;

import com.licenta.repository.RiskRepository;
import com.licenta.service.RiskService;
import com.licenta.service.dto.PhaseCreateDTO;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.dto.RiskDTO;
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
 * REST controller for managing {@link com.licenta.domain.Risk}.
 */
@RestController
@RequestMapping("/api")
public class RiskResource {

    private final Logger log = LoggerFactory.getLogger(RiskResource.class);

    private static final String ENTITY_NAME = "risk";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RiskService riskService;

    private final RiskRepository riskRepository;

    public RiskResource(RiskService riskService, RiskRepository riskRepository) {
        this.riskService = riskService;
        this.riskRepository = riskRepository;
    }

    /**
     * {@code POST  /risks} : Create a new risk.
     *
     * @param riskDTO the riskDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new riskDTO, or with status {@code 400 (Bad Request)} if the risk has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/risks")
    public ResponseEntity<RiskDTO> createRisk(@RequestBody RiskDTO riskDTO) throws URISyntaxException {
        log.debug("REST request to save Risk : {}", riskDTO);
        if (riskDTO.getId() != null) {
            throw new BadRequestAlertException("A new risk cannot already have an ID", ENTITY_NAME, "idexists");
        }
        RiskDTO result = riskService.save(riskDTO);
        return ResponseEntity
            .created(new URI("/api/risks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/risks/phase/{id}")
    public ResponseEntity<RiskDTO> createRiskPhase(@PathVariable final Long id, @RequestBody RiskDTO riskDTO) throws URISyntaxException {
        log.debug("REST request to save Risk : {}", riskDTO);

        RiskDTO result = riskService.saveRiskAndPhase(riskDTO, id);
        return ResponseEntity
            .created(new URI("/api/risks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /risks/:id} : Updates an existing risk.
     *
     * @param id the id of the riskDTO to save.
     * @param riskDTO the riskDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated riskDTO,
     * or with status {@code 400 (Bad Request)} if the riskDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the riskDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/risks/{id}")
    public ResponseEntity<RiskDTO> updateRisk(@PathVariable(value = "id", required = false) final Long id, @RequestBody RiskDTO riskDTO)
        throws URISyntaxException {
        log.debug("REST request to update Risk : {}, {}", id, riskDTO);
        if (riskDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, riskDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!riskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RiskDTO result = riskService.update(riskDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, riskDTO.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /risks/:id} : Partial updates given fields of an existing risk, field will ignore if it is null
     *
     * @param id the id of the riskDTO to save.
     * @param riskDTO the riskDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated riskDTO,
     * or with status {@code 400 (Bad Request)} if the riskDTO is not valid,
     * or with status {@code 404 (Not Found)} if the riskDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the riskDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/risks/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RiskDTO> partialUpdateRisk(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody RiskDTO riskDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Risk partially : {}, {}", id, riskDTO);
        if (riskDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, riskDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!riskRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RiskDTO> result = riskService.partialUpdate(riskDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, riskDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /risks} : get all the risks.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of risks in body.
     */
    @GetMapping("/risks")
    public List<RiskDTO> getAllRisks() {
        log.debug("REST request to get all Risks");
        return riskService.findAll();
    }

    /**
     * {@code GET  /risks/:id} : get the "id" risk.
     *
     * @param id the id of the riskDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the riskDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/risks/{id}")
    public ResponseEntity<RiskDTO> getRisk(@PathVariable Long id) {
        log.debug("REST request to get Risk : {}", id);
        Optional<RiskDTO> riskDTO = riskService.findOne(id);
        return ResponseUtil.wrapOrNotFound(riskDTO);
    }

    /**
     * {@code DELETE  /risks/:id} : delete the "id" risk.
     *
     * @param id the id of the riskDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/risks/{id}")
    public ResponseEntity<Void> deleteRisk(@PathVariable Long id) {
        log.debug("REST request to delete Risk : {}", id);
        riskService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
