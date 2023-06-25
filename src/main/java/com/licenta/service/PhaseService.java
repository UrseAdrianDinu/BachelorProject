package com.licenta.service;

import com.licenta.domain.Company;
import com.licenta.domain.Phase;
import com.licenta.domain.Project;
import com.licenta.domain.enumeration.PhaseStatus;
import com.licenta.domain.enumeration.ProjectStatus;
import com.licenta.repository.PhaseRepository;
import com.licenta.repository.ProjectRepository;
import com.licenta.service.dto.*;
import com.licenta.service.mapper.PhaseMapper;
import com.licenta.service.mapper.RiskMapper;
import com.licenta.service.mapper.SprintMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Phase}.
 */
@Service
@Transactional
public class PhaseService {

    private final Logger log = LoggerFactory.getLogger(PhaseService.class);

    private final PhaseRepository phaseRepository;

    private final ProjectRepository projectRepository;
    private final PhaseMapper phaseMapper;
    private final RiskMapper riskMapper;

    private final SprintMapper sprintMapper;

    public PhaseService(
        PhaseRepository phaseRepository,
        ProjectRepository projectRepository,
        PhaseMapper phaseMapper,
        RiskMapper riskMapper,
        SprintMapper sprintMapper
    ) {
        this.phaseRepository = phaseRepository;
        this.projectRepository = projectRepository;
        this.phaseMapper = phaseMapper;
        this.riskMapper = riskMapper;
        this.sprintMapper = sprintMapper;
    }

    /**
     * Save a phase.
     *
     * @param phaseDTO the entity to save.
     * @return the persisted entity.
     */
    public PhaseDTO save(PhaseDTO phaseDTO) {
        log.debug("Request to save Phase : {}", phaseDTO);
        Phase phase = phaseMapper.toEntity(phaseDTO);
        phase = phaseRepository.save(phase);
        return phaseMapper.toDto(phase);
    }

    public PhaseDTO savePhaseAndProject(PhaseCreateDTO phaseCreateDTO, Long id) {
        log.debug("Request to save Project  Phase: {}", phaseCreateDTO);
        Phase phase = new Phase();
        phase.setName(phaseCreateDTO.getName());
        phase.setObjective(phaseCreateDTO.getObjective());
        phase.setDescription(phaseCreateDTO.getDescription());
        phase.setStartDate(phaseCreateDTO.getStartDate());
        phase.setEstimatedTime(phaseCreateDTO.getEstimatedTime());
        phase.setStatus(PhaseStatus.CLOSED);

        Optional<Project> optionalProject = projectRepository.findById(id);
        if (optionalProject.isPresent()) {
            Project project = optionalProject.get();
            phase.setProject(project);
        }
        phase = phaseRepository.save(phase);
        return phaseMapper.toDto(phase);
    }

    public PhaseDTO setPhaseActive(Long id) {
        log.debug("Request to save Project Phase: {}", id);
        Optional<Phase> optionalPhase = phaseRepository.findById(id);
        if (optionalPhase.isPresent()) {
            Phase phase = optionalPhase.get();
            phase.setStatus(PhaseStatus.ACTIVE);
            phase = phaseRepository.save(phase);
            return phaseMapper.toDto(phase);
        } else {
            return null;
        }
    }

    /**
     * Update a phase.
     *
     * @param phaseDTO the entity to save.
     * @return the persisted entity.
     */
    public PhaseDTO update(PhaseDTO phaseDTO) {
        log.debug("Request to update Phase : {}", phaseDTO);
        Phase phase = phaseMapper.toEntity(phaseDTO);
        phase = phaseRepository.save(phase);
        return phaseMapper.toDto(phase);
    }

    /**
     * Partially update a phase.
     *
     * @param phaseDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PhaseDTO> partialUpdate(PhaseDTO phaseDTO) {
        log.debug("Request to partially update Phase : {}", phaseDTO);

        return phaseRepository
            .findById(phaseDTO.getId())
            .map(existingPhase -> {
                phaseMapper.partialUpdate(existingPhase, phaseDTO);

                return existingPhase;
            })
            .map(phaseRepository::save)
            .map(phaseMapper::toDto);
    }

    /**
     * Get all the phases.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<PhaseDTO> findAll() {
        log.debug("Request to get all Phases");
        return phaseRepository.findAll().stream().map(phaseMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one phase by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PhaseDTO> findOne(Long id) {
        log.debug("Request to get Phase : {}", id);
        return phaseRepository.findById(id).map(phaseMapper::toDto);
    }

    @Transactional(readOnly = true)
    public List<RiskDTO> findPhaseRisks(Long id) {
        Optional<Phase> projectOptional = phaseRepository.findById(id);
        return projectOptional.map(value -> value.getRisks().stream().map(riskMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<SprintDTO> findPhaseSprints(Long id) {
        Optional<Phase> projectOptional = phaseRepository.findById(id);
        return projectOptional.map(value -> value.getSprints().stream().map(sprintMapper::toDto).collect(Collectors.toList())).orElse(null);
    }

    /**
     * Delete the phase by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Phase : {}", id);
        phaseRepository.deleteById(id);
    }
}
