package com.licenta.service.mapper;

import com.licenta.domain.Phase;
import com.licenta.domain.Sprint;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.dto.SprintDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Sprint} and its DTO {@link SprintDTO}.
 */
@Mapper(componentModel = "spring")
public interface SprintMapper extends EntityMapper<SprintDTO, Sprint> {
    @Mapping(target = "phase", source = "phase", qualifiedByName = "phaseId")
    SprintDTO toDto(Sprint s);

    @Named("phaseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PhaseDTO toDtoPhaseId(Phase phase);
}
