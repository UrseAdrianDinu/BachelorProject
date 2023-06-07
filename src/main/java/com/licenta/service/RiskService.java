package com.licenta.service;

import com.licenta.domain.Phase;
import com.licenta.domain.Project;
import com.licenta.domain.Risk;
import com.licenta.domain.enumeration.PhaseStatus;
import com.licenta.repository.PhaseRepository;
import com.licenta.repository.RiskRepository;
import com.licenta.service.dto.PhaseCreateDTO;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.dto.RiskDTO;
import com.licenta.service.mapper.RiskMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Risk}.
 */
@Service
@Transactional
public class RiskService {

    private final Logger log = LoggerFactory.getLogger(RiskService.class);

    private final RiskRepository riskRepository;

    private final PhaseRepository phaseRepository;

    private final RiskMapper riskMapper;

    public RiskService(RiskRepository riskRepository, PhaseRepository phaseRepository, RiskMapper riskMapper) {
        this.riskRepository = riskRepository;
        this.phaseRepository = phaseRepository;
        this.riskMapper = riskMapper;
    }

    /**
     * Save a risk.
     *
     * @param riskDTO the entity to save.
     * @return the persisted entity.
     */
    public RiskDTO save(RiskDTO riskDTO) {
        log.debug("Request to save Risk : {}", riskDTO);
        Risk risk = riskMapper.toEntity(riskDTO);
        risk = riskRepository.save(risk);
        return riskMapper.toDto(risk);
    }

    public RiskDTO saveRiskAndPhase(RiskDTO riskDTO, Long id) {
        log.debug("Request to save Phase Risk: {}", riskDTO);
        Risk risk = riskMapper.toEntity(riskDTO);

        Optional<Phase> optionalPhase = phaseRepository.findById(id);
        if (optionalPhase.isPresent()) {
            Phase phase = optionalPhase.get();
            risk.setPhase(phase);
        }
        risk = riskRepository.save(risk);
        return riskMapper.toDto(risk);
    }

    /**
     * Update a risk.
     *
     * @param riskDTO the entity to save.
     * @return the persisted entity.
     */
    public RiskDTO update(RiskDTO riskDTO) {
        log.debug("Request to update Risk : {}", riskDTO);
        Risk risk = riskMapper.toEntity(riskDTO);
        risk = riskRepository.save(risk);
        return riskMapper.toDto(risk);
    }

    /**
     * Partially update a risk.
     *
     * @param riskDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<RiskDTO> partialUpdate(RiskDTO riskDTO) {
        log.debug("Request to partially update Risk : {}", riskDTO);

        return riskRepository
            .findById(riskDTO.getId())
            .map(existingRisk -> {
                riskMapper.partialUpdate(existingRisk, riskDTO);

                return existingRisk;
            })
            .map(riskRepository::save)
            .map(riskMapper::toDto);
    }

    /**
     * Get all the risks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<RiskDTO> findAll() {
        log.debug("Request to get all Risks");
        return riskRepository.findAll().stream().map(riskMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one risk by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<RiskDTO> findOne(Long id) {
        log.debug("Request to get Risk : {}", id);
        return riskRepository.findById(id).map(riskMapper::toDto);
    }

    /**
     * Delete the risk by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Risk : {}", id);
        riskRepository.deleteById(id);
    }
}
