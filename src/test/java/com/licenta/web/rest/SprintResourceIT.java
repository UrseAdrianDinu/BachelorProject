package com.licenta.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.licenta.IntegrationTest;
import com.licenta.domain.Sprint;
import com.licenta.domain.enumeration.SprintStatus;
import com.licenta.repository.SprintRepository;
import com.licenta.service.dto.SprintDTO;
import com.licenta.service.mapper.SprintMapper;
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
 * Integration tests for the {@link SprintResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SprintResourceIT {

    private static final Integer DEFAULT_NUMBER = 1;
    private static final Integer UPDATED_NUMBER = 2;

    private static final SprintStatus DEFAULT_STATUS = SprintStatus.FUTURE;
    private static final SprintStatus UPDATED_STATUS = SprintStatus.ACTIVE;

    private static final String DEFAULT_GOAL = "AAAAAAAAAA";
    private static final String UPDATED_GOAL = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_START_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_START_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_END_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_END_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/sprints";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private SprintMapper sprintMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSprintMockMvc;

    private Sprint sprint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sprint createEntity(EntityManager em) {
        Sprint sprint = new Sprint()
            .number(DEFAULT_NUMBER)
            .status(DEFAULT_STATUS)
            .goal(DEFAULT_GOAL)
            .startDate(DEFAULT_START_DATE)
            .endDate(DEFAULT_END_DATE);
        return sprint;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Sprint createUpdatedEntity(EntityManager em) {
        Sprint sprint = new Sprint()
            .number(UPDATED_NUMBER)
            .status(UPDATED_STATUS)
            .goal(UPDATED_GOAL)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
        return sprint;
    }

    @BeforeEach
    public void initTest() {
        sprint = createEntity(em);
    }

    @Test
    @Transactional
    void createSprint() throws Exception {
        int databaseSizeBeforeCreate = sprintRepository.findAll().size();
        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);
        restSprintMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sprintDTO)))
            .andExpect(status().isCreated());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeCreate + 1);
        Sprint testSprint = sprintList.get(sprintList.size() - 1);
        assertThat(testSprint.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testSprint.getStatus()).isEqualTo(DEFAULT_STATUS);
        assertThat(testSprint.getGoal()).isEqualTo(DEFAULT_GOAL);
        assertThat(testSprint.getStartDate()).isEqualTo(DEFAULT_START_DATE);
        assertThat(testSprint.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void createSprintWithExistingId() throws Exception {
        // Create the Sprint with an existing ID
        sprint.setId(1L);
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        int databaseSizeBeforeCreate = sprintRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSprintMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sprintDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSprints() throws Exception {
        // Initialize the database
        sprintRepository.saveAndFlush(sprint);

        // Get all the sprintList
        restSprintMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(sprint.getId().intValue())))
            .andExpect(jsonPath("$.[*].number").value(hasItem(DEFAULT_NUMBER)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS.toString())))
            .andExpect(jsonPath("$.[*].goal").value(hasItem(DEFAULT_GOAL)))
            .andExpect(jsonPath("$.[*].startDate").value(hasItem(DEFAULT_START_DATE.toString())))
            .andExpect(jsonPath("$.[*].endDate").value(hasItem(DEFAULT_END_DATE.toString())));
    }

    @Test
    @Transactional
    void getSprint() throws Exception {
        // Initialize the database
        sprintRepository.saveAndFlush(sprint);

        // Get the sprint
        restSprintMockMvc
            .perform(get(ENTITY_API_URL_ID, sprint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(sprint.getId().intValue()))
            .andExpect(jsonPath("$.number").value(DEFAULT_NUMBER))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS.toString()))
            .andExpect(jsonPath("$.goal").value(DEFAULT_GOAL))
            .andExpect(jsonPath("$.startDate").value(DEFAULT_START_DATE.toString()))
            .andExpect(jsonPath("$.endDate").value(DEFAULT_END_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingSprint() throws Exception {
        // Get the sprint
        restSprintMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSprint() throws Exception {
        // Initialize the database
        sprintRepository.saveAndFlush(sprint);

        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();

        // Update the sprint
        Sprint updatedSprint = sprintRepository.findById(sprint.getId()).get();
        // Disconnect from session so that the updates on updatedSprint are not directly saved in db
        em.detach(updatedSprint);
        updatedSprint
            .number(UPDATED_NUMBER)
            .status(UPDATED_STATUS)
            .goal(UPDATED_GOAL)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);
        SprintDTO sprintDTO = sprintMapper.toDto(updatedSprint);

        restSprintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sprintDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sprintDTO))
            )
            .andExpect(status().isOk());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
        Sprint testSprint = sprintList.get(sprintList.size() - 1);
        assertThat(testSprint.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testSprint.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSprint.getGoal()).isEqualTo(UPDATED_GOAL);
        assertThat(testSprint.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testSprint.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void putNonExistingSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();
        sprint.setId(count.incrementAndGet());

        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSprintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, sprintDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sprintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();
        sprint.setId(count.incrementAndGet());

        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSprintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(sprintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();
        sprint.setId(count.incrementAndGet());

        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSprintMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(sprintDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSprintWithPatch() throws Exception {
        // Initialize the database
        sprintRepository.saveAndFlush(sprint);

        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();

        // Update the sprint using partial update
        Sprint partialUpdatedSprint = new Sprint();
        partialUpdatedSprint.setId(sprint.getId());

        partialUpdatedSprint.status(UPDATED_STATUS).goal(UPDATED_GOAL).startDate(UPDATED_START_DATE);

        restSprintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSprint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSprint))
            )
            .andExpect(status().isOk());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
        Sprint testSprint = sprintList.get(sprintList.size() - 1);
        assertThat(testSprint.getNumber()).isEqualTo(DEFAULT_NUMBER);
        assertThat(testSprint.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSprint.getGoal()).isEqualTo(UPDATED_GOAL);
        assertThat(testSprint.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testSprint.getEndDate()).isEqualTo(DEFAULT_END_DATE);
    }

    @Test
    @Transactional
    void fullUpdateSprintWithPatch() throws Exception {
        // Initialize the database
        sprintRepository.saveAndFlush(sprint);

        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();

        // Update the sprint using partial update
        Sprint partialUpdatedSprint = new Sprint();
        partialUpdatedSprint.setId(sprint.getId());

        partialUpdatedSprint
            .number(UPDATED_NUMBER)
            .status(UPDATED_STATUS)
            .goal(UPDATED_GOAL)
            .startDate(UPDATED_START_DATE)
            .endDate(UPDATED_END_DATE);

        restSprintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSprint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSprint))
            )
            .andExpect(status().isOk());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
        Sprint testSprint = sprintList.get(sprintList.size() - 1);
        assertThat(testSprint.getNumber()).isEqualTo(UPDATED_NUMBER);
        assertThat(testSprint.getStatus()).isEqualTo(UPDATED_STATUS);
        assertThat(testSprint.getGoal()).isEqualTo(UPDATED_GOAL);
        assertThat(testSprint.getStartDate()).isEqualTo(UPDATED_START_DATE);
        assertThat(testSprint.getEndDate()).isEqualTo(UPDATED_END_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();
        sprint.setId(count.incrementAndGet());

        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSprintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, sprintDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sprintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();
        sprint.setId(count.incrementAndGet());

        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSprintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(sprintDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSprint() throws Exception {
        int databaseSizeBeforeUpdate = sprintRepository.findAll().size();
        sprint.setId(count.incrementAndGet());

        // Create the Sprint
        SprintDTO sprintDTO = sprintMapper.toDto(sprint);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSprintMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(sprintDTO))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Sprint in the database
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSprint() throws Exception {
        // Initialize the database
        sprintRepository.saveAndFlush(sprint);

        int databaseSizeBeforeDelete = sprintRepository.findAll().size();

        // Delete the sprint
        restSprintMockMvc
            .perform(delete(ENTITY_API_URL_ID, sprint.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Sprint> sprintList = sprintRepository.findAll();
        assertThat(sprintList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
