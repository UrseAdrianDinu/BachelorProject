package com.licenta.service;

import com.licenta.domain.Phase;
import com.licenta.domain.Risk;
import com.licenta.domain.Sprint;
import com.licenta.repository.PhaseRepository;
import com.licenta.repository.SprintRepository;
import com.licenta.service.dto.RiskDTO;
import com.licenta.service.dto.SprintDTO;
import com.licenta.service.dto.TaskDTO;
import com.licenta.service.mapper.SprintMapper;
import com.licenta.service.mapper.TaskMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Sprint}.
 */
@Service
@Transactional
public class SprintService {

    private final Logger log = LoggerFactory.getLogger(SprintService.class);

    private final SprintRepository sprintRepository;
    private final PhaseRepository phaseRepository;
    private final SprintMapper sprintMapper;
    private final TaskMapper taskMapper;

    public SprintService(
        SprintRepository sprintRepository,
        PhaseRepository phaseRepository,
        SprintMapper sprintMapper,
        TaskMapper taskMapper
    ) {
        this.sprintRepository = sprintRepository;
        this.phaseRepository = phaseRepository;
        this.sprintMapper = sprintMapper;
        this.taskMapper = taskMapper;
    }

    /**
     * Save a sprint.
     *
     * @param sprintDTO the entity to save.
     * @return the persisted entity.
     */
    public SprintDTO save(SprintDTO sprintDTO) {
        log.debug("Request to save Sprint : {}", sprintDTO);
        Sprint sprint = sprintMapper.toEntity(sprintDTO);
        sprint = sprintRepository.save(sprint);
        return sprintMapper.toDto(sprint);
    }

    public SprintDTO saveSprintAndPhase(SprintDTO sprintDTO, Long id) {
        log.debug("Request to save Phase Sprint: {}", sprintDTO);
        Sprint sprint = sprintMapper.toEntity(sprintDTO);

        Optional<Phase> optionalPhase = phaseRepository.findById(id);
        if (optionalPhase.isPresent()) {
            Phase phase = optionalPhase.get();
            sprint.setPhase(phase);
        }
        sprint = sprintRepository.save(sprint);
        return sprintMapper.toDto(sprint);
    }

    /**
     * Update a sprint.
     *
     * @param sprintDTO the entity to save.
     * @return the persisted entity.
     */
    public SprintDTO update(SprintDTO sprintDTO) {
        log.debug("Request to update Sprint : {}", sprintDTO);
        Sprint sprint = sprintMapper.toEntity(sprintDTO);
        sprint = sprintRepository.save(sprint);
        return sprintMapper.toDto(sprint);
    }

    /**
     * Partially update a sprint.
     *
     * @param sprintDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<SprintDTO> partialUpdate(SprintDTO sprintDTO) {
        log.debug("Request to partially update Sprint : {}", sprintDTO);

        return sprintRepository
            .findById(sprintDTO.getId())
            .map(existingSprint -> {
                sprintMapper.partialUpdate(existingSprint, sprintDTO);

                return existingSprint;
            })
            .map(sprintRepository::save)
            .map(sprintMapper::toDto);
    }

    /**
     * Get all the sprints.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<SprintDTO> findAll() {
        log.debug("Request to get all Sprints");
        return sprintRepository.findAll().stream().map(sprintMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one sprint by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<SprintDTO> findOne(Long id) {
        log.debug("Request to get Sprint : {}", id);
        return sprintRepository.findById(id).map(sprintMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<TaskDTO> findSprintTasks(Long id) {
        log.debug("Request to get Sprint : {}", id);
        Optional<Sprint> sprintOptional = sprintRepository.findById(id);
        return sprintOptional.map(value -> value.getTasks().stream().map(taskMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    /**
     * Delete the sprint by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Sprint : {}", id);
        sprintRepository.deleteById(id);
    }
}
