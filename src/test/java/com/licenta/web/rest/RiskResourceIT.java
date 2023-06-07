package com.licenta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.licenta.IntegrationTest;
import com.licenta.domain.Risk;
import com.licenta.domain.enumeration.ProbabilityValue;
import com.licenta.repository.RiskRepository;
import com.licenta.service.dto.RiskDTO;
import com.licenta.service.mapper.RiskMapper;
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
 * Integration tests for the {@link RiskResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RiskResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final ProbabilityValue DEFAULT_PROBABILITY = ProbabilityValue.LOW;
    private static final ProbabilityValue UPDATED_PROBABILITY = ProbabilityValue.MEDIUM;

    private static final String DEFAULT_IMPACT = "AAAAAAAAAA";
    private static final String UPDATED_IMPACT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/risks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RiskRepository riskRepository;

    @Autowired
    private RiskMapper riskMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRiskMockMvc;

    private Risk risk;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Risk createEntity(EntityManager em) {
        Risk risk = new Risk().description(DEFAULT_DESCRIPTION).probability(DEFAULT_PROBABILITY).impact(DEFAULT_IMPACT);
        return risk;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Risk createUpdatedEntity(EntityManager em) {
        Risk risk = new Risk().description(UPDATED_DESCRIPTION).probability(UPDATED_PROBABILITY).impact(UPDATED_IMPACT);
        return risk;
    }

    @BeforeEach
    public void initTest() {
        risk = createEntity(em);
    }

    @Test
    @Transactional
    void createRisk() throws Exception {
        int databaseSizeBeforeCreate = riskRepository.findAll().size();
        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);
        restRiskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(riskDTO)))
            .andExpect(status().isCreated());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeCreate + 1);
        Risk testRisk = riskList.get(riskList.size() - 1);
        assertThat(testRisk.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRisk.getProbability()).isEqualTo(DEFAULT_PROBABILITY);
        assertThat(testRisk.getImpact()).isEqualTo(DEFAULT_IMPACT);
    }

    @Test
    @Transactional
    void createRiskWithExistingId() throws Exception {
        // Create the Risk with an existing ID
        risk.setId(1L);
        RiskDTO riskDTO = riskMapper.toDto(risk);

        int databaseSizeBeforeCreate = riskRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRiskMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(riskDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRisks() throws Exception {
        // Initialize the database
        riskRepository.saveAndFlush(risk);

        // Get all the riskList
        restRiskMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(risk.getId().intValue())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].probability").value(hasItem(DEFAULT_PROBABILITY.toString())))
            .andExpect(jsonPath("$.[*].impact").value(hasItem(DEFAULT_IMPACT)));
    }

    @Test
    @Transactional
    void getRisk() throws Exception {
        // Initialize the database
        riskRepository.saveAndFlush(risk);

        // Get the risk
        restRiskMockMvc
            .perform(get(ENTITY_API_URL_ID, risk.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(risk.getId().intValue()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.probability").value(DEFAULT_PROBABILITY.toString()))
            .andExpect(jsonPath("$.impact").value(DEFAULT_IMPACT));
    }

    @Test
    @Transactional
    void getNonExistingRisk() throws Exception {
        // Get the risk
        restRiskMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRisk() throws Exception {
        // Initialize the database
        riskRepository.saveAndFlush(risk);

        int databaseSizeBeforeUpdate = riskRepository.findAll().size();

        // Update the risk
        Risk updatedRisk = riskRepository.findById(risk.getId()).get();
        // Disconnect from session so that the updates on updatedRisk are not directly saved in db
        em.detach(updatedRisk);
        updatedRisk.description(UPDATED_DESCRIPTION).probability(UPDATED_PROBABILITY).impact(UPDATED_IMPACT);
        RiskDTO riskDTO = riskMapper.toDto(updatedRisk);

        restRiskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, riskDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(riskDTO))
            )
            .andExpect(status().isOk());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
        Risk testRisk = riskList.get(riskList.size() - 1);
        assertThat(testRisk.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRisk.getProbability()).isEqualTo(UPDATED_PROBABILITY);
        assertThat(testRisk.getImpact()).isEqualTo(UPDATED_IMPACT);
    }

    @Test
    @Transactional
    void putNonExistingRisk() throws Exception {
        int databaseSizeBeforeUpdate = riskRepository.findAll().size();
        risk.setId(count.incrementAndGet());

        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRiskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, riskDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(riskDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRisk() throws Exception {
        int databaseSizeBeforeUpdate = riskRepository.findAll().size();
        risk.setId(count.incrementAndGet());

        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRiskMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(riskDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRisk() throws Exception {
        int databaseSizeBeforeUpdate = riskRepository.findAll().size();
        risk.setId(count.incrementAndGet());

        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRiskMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(riskDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRiskWithPatch() throws Exception {
        // Initialize the database
        riskRepository.saveAndFlush(risk);

        int databaseSizeBeforeUpdate = riskRepository.findAll().size();

        // Update the risk using partial update
        Risk partialUpdatedRisk = new Risk();
        partialUpdatedRisk.setId(risk.getId());

        partialUpdatedRisk.impact(UPDATED_IMPACT);

        restRiskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRisk.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRisk))
            )
            .andExpect(status().isOk());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
        Risk testRisk = riskList.get(riskList.size() - 1);
        assertThat(testRisk.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testRisk.getProbability()).isEqualTo(DEFAULT_PROBABILITY);
        assertThat(testRisk.getImpact()).isEqualTo(UPDATED_IMPACT);
    }

    @Test
    @Transactional
    void fullUpdateRiskWithPatch() throws Exception {
        // Initialize the database
        riskRepository.saveAndFlush(risk);

        int databaseSizeBeforeUpdate = riskRepository.findAll().size();

        // Update the risk using partial update
        Risk partialUpdatedRisk = new Risk();
        partialUpdatedRisk.setId(risk.getId());

        partialUpdatedRisk.description(UPDATED_DESCRIPTION).probability(UPDATED_PROBABILITY).impact(UPDATED_IMPACT);

        restRiskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRisk.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRisk))
            )
            .andExpect(status().isOk());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
        Risk testRisk = riskList.get(riskList.size() - 1);
        assertThat(testRisk.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testRisk.getProbability()).isEqualTo(UPDATED_PROBABILITY);
        assertThat(testRisk.getImpact()).isEqualTo(UPDATED_IMPACT);
    }

    @Test
    @Transactional
    void patchNonExistingRisk() throws Exception {
        int databaseSizeBeforeUpdate = riskRepository.findAll().size();
        risk.setId(count.incrementAndGet());

        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRiskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, riskDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(riskDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRisk() throws Exception {
        int databaseSizeBeforeUpdate = riskRepository.findAll().size();
        risk.setId(count.incrementAndGet());

        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRiskMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(riskDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRisk() throws Exception {
        int databaseSizeBeforeUpdate = riskRepository.findAll().size();
        risk.setId(count.incrementAndGet());

        // Create the Risk
        RiskDTO riskDTO = riskMapper.toDto(risk);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRiskMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(riskDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Risk in the database
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRisk() throws Exception {
        // Initialize the database
        riskRepository.saveAndFlush(risk);

        int databaseSizeBeforeDelete = riskRepository.findAll().size();

        // Delete the risk
        restRiskMockMvc
            .perform(delete(ENTITY_API_URL_ID, risk.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Risk> riskList = riskRepository.findAll();
        assertThat(riskList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
