package com.licenta.service.mapper;

import com.licenta.domain.Phase;
import com.licenta.domain.Project;
import com.licenta.service.dto.PhaseDTO;
import com.licenta.service.dto.ProjectDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Phase} and its DTO {@link PhaseDTO}.
 */
@Mapper(componentModel = "spring")
public interface PhaseMapper extends EntityMapper<PhaseDTO, Phase> {
    @Mapping(target = "project", source = "project", qualifiedByName = "projectId")
    PhaseDTO toDto(Phase s);

    @Named("projectId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProjectDTO toDtoProjectId(Project project);
}
