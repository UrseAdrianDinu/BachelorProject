package com.licenta.service.mapper;

import com.licenta.domain.Phase;
import com.licenta.domain.Risk;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.dto.RiskDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Risk} and its DTO {@link RiskDTO}.
 */
@Mapper(componentModel = "spring")
public interface RiskMapper extends EntityMapper<RiskDTO, Risk> {
    @Mapping(target = "phase", source = "phase", qualifiedByName = "phaseId")
    RiskDTO toDto(Risk s);

    @Named("phaseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PhaseDTO toDtoPhaseId(Phase phase);
}
