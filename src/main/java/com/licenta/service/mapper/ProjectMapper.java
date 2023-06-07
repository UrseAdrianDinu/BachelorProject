package com.licenta.service.mapper;

import com.licenta.domain.Company;
import com.licenta.domain.Project;
import com.licenta.domain.Team;
import com.licenta.service.dto.CompanyDTO;
import com.licenta.service.dto.ProjectDTO;
import com.licenta.service.dto.TeamDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Project} and its DTO {@link ProjectDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProjectMapper extends EntityMapper<ProjectDTO, Project> {
    @Mapping(target = "teams", source = "teams", qualifiedByName = "teamIdSet")
    @Mapping(target = "company", source = "company", qualifiedByName = "companyId")
    ProjectDTO toDto(Project s);

    @Mapping(target = "removeTeam", ignore = true)
    Project toEntity(ProjectDTO projectDTO);

    @Named("teamId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TeamDTO toDtoTeamId(Team team);

    @Named("teamIdSet")
    default Set<TeamDTO> toDtoTeamIdSet(Set<Team> team) {
        return team.stream().map(this::toDtoTeamId).collect(Collectors.toSet());
    }

    @Named("companyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CompanyDTO toDtoCompanyId(Company company);
}
