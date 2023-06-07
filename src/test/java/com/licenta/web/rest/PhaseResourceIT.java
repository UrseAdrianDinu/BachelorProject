package com.licenta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.licenta.IntegrationTest;
import com.licenta.domain.Phase;
import com.licenta.repository.PhaseRepository;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.mapper.PhaseMapper;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PhaseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PhaseResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OBJECTIVE = "AAAAAAAAAA";
    private static final String UPDATED_OBJECTIVE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_ESTIMATED_TIME = 1;
    private static final Integer UPDATED_ESTIMATED_TIME = 2;

    private static final String ENTITY_API_URL = "/api/phases";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PhaseRepository phaseRepository;

    @Autowired
    private PhaseMapper phaseMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPhaseMockMvc;

    private Phase phase;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Phase createEntity(EntityManager em) {
        Phase phase = new Phase()
            .name(DEFAULT_NAME)
            .objective(DEFAULT_OBJECTIVE)
            .description(DEFAULT_DESCRIPTION)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE)
            .estimatedTime(DEFAULT_ESTIMATED_TIME);
        return phase;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Phase createUpdatedEntity(EntityManager em) {
        Phase phase = new Phase()
            .name(UPDATED_NAME)
            .objective(UPDATED_OBJECTIVE)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .estimatedTime(UPDATED_ESTIMATED_TIME);
        return phase;
    }

    @BeforeEach
    public void initTest() {
        phase = createEntity(em);
    }

    @Test
    @Transactional
    void createPhase() throws Exception {
        int databaseSizeBeforeCreate = phaseRepository.findAll().size();
        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);
        restPhaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(phaseDTO)))
            .andExpect(status().isCreated());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeCreate + 1);
        Phase testPhase = phaseList.get(phaseList.size() - 1);
        assertThat(testPhase.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPhase.getObjective()).isEqualTo(DEFAULT_OBJECTIVE);
        assertThat(testPhase.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPhase.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testPhase.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testPhase.getEstimatedTime()).isEqualTo(DEFAULT_ESTIMATED_TIME);
    }

    @Test
    @Transactional
    void createPhaseWithExistingId() throws Exception {
        // Create the Phase with an existing ID
        phase.setId(1L);
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        int databaseSizeBeforeCreate = phaseRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPhaseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(phaseDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPhases() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        // Get all the phaseList
        restPhaseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(phase.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].objective").value(hasItem(DEFAULT_OBJECTIVE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())))
            .andExpect(jsonPath("$.[*].estimatedTime").value(hasItem(DEFAULT_ESTIMATED_TIME)));
    }

    @Test
    @Transactional
    void getPhase() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        // Get the phase
        restPhaseMockMvc
            .perform(get(ENTITY_API_URL_ID, phase.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(phase.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.objective").value(DEFAULT_OBJECTIVE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()))
            .andExpect(jsonPath("$.estimatedTime").value(DEFAULT_ESTIMATED_TIME));
    }

    @Test
    @Transactional
    void getNonExistingPhase() throws Exception {
        // Get the phase
        restPhaseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPhase() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();

        // Update the phase
        Phase updatedPhase = phaseRepository.findById(phase.getId()).get();
        // Disconnect from session so that the updates on updatedPhase are not directly saved in db
        em.detach(updatedPhase);
        updatedPhase
            .name(UPDATED_NAME)
            .objective(UPDATED_OBJECTIVE)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .estimatedTime(UPDATED_ESTIMATED_TIME);
        PhaseDTO phaseDTO = phaseMapper.toDto(updatedPhase);

        restPhaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, phaseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phaseDTO))
            )
            .andExpect(status().isOk());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
        Phase testPhase = phaseList.get(phaseList.size() - 1);
        assertThat(testPhase.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPhase.getObjective()).isEqualTo(UPDATED_OBJECTIVE);
        assertThat(testPhase.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPhase.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPhase.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPhase.getEstimatedTime()).isEqualTo(UPDATED_ESTIMATED_TIME);
    }

    @Test
    @Transactional
    void putNonExistingPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();
        phase.setId(count.incrementAndGet());

        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, phaseDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phaseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();
        phase.setId(count.incrementAndGet());

        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhaseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(phaseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();
        phase.setId(count.incrementAndGet());

        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhaseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(phaseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePhaseWithPatch() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();

        // Update the phase using partial update
        Phase partialUpdatedPhase = new Phase();
        partialUpdatedPhase.setId(phase.getId());

        partialUpdatedPhase.objective(UPDATED_OBJECTIVE).description(UPDATED_DESCRIPTION).startDate(UPDATED_START_DATE);

        restPhaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhase.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhase))
            )
            .andExpect(status().isOk());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
        Phase testPhase = phaseList.get(phaseList.size() - 1);
        assertThat(testPhase.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPhase.getObjective()).isEqualTo(UPDATED_OBJECTIVE);
        assertThat(testPhase.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPhase.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPhase.getEndDate()).isEqualTo(DEFAULT_END_DATE);
        assertThat(testPhase.getEstimatedTime()).isEqualTo(DEFAULT_ESTIMATED_TIME);
    }

    @Test
    @Transactional
    void fullUpdatePhaseWithPatch() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();

        // Update the phase using partial update
        Phase partialUpdatedPhase = new Phase();
        partialUpdatedPhase.setId(phase.getId());

        partialUpdatedPhase
            .name(UPDATED_NAME)
            .objective(UPDATED_OBJECTIVE)
            .description(UPDATED_DESCRIPTION)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE)
            .estimatedTime(UPDATED_ESTIMATED_TIME);

        restPhaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPhase.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPhase))
            )
            .andExpect(status().isOk());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
        Phase testPhase = phaseList.get(phaseList.size() - 1);
        assertThat(testPhase.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPhase.getObjective()).isEqualTo(UPDATED_OBJECTIVE);
        assertThat(testPhase.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPhase.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testPhase.getEndDate()).isEqualTo(UPDATED_END_DATE);
        assertThat(testPhase.getEstimatedTime()).isEqualTo(UPDATED_ESTIMATED_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();
        phase.setId(count.incrementAndGet());

        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPhaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, phaseDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phaseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();
        phase.setId(count.incrementAndGet());

        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhaseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(phaseDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPhase() throws Exception {
        int databaseSizeBeforeUpdate = phaseRepository.findAll().size();
        phase.setId(count.incrementAndGet());

        // Create the Phase
        PhaseDTO phaseDTO = phaseMapper.toDto(phase);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPhaseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(phaseDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Phase in the database
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePhase() throws Exception {
        // Initialize the database
        phaseRepository.saveAndFlush(phase);

        int databaseSizeBeforeDelete = phaseRepository.findAll().size();

        // Delete the phase
        restPhaseMockMvc
            .perform(delete(ENTITY_API_URL_ID, phase.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Phase> phaseList = phaseRepository.findAll();
        assertThat(phaseList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
