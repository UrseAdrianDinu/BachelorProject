package com.licenta.service.mapper;

import com.licenta.domain.Person;
import com.licenta.domain.Project;
import com.licenta.domain.Sprint;
import com.licenta.domain.Task;
import com.licenta.domain.Team;
import com.licenta.service.dto.PersonDTO;
import com.licenta.service.dto.ProjectDTO;
import com.licenta.service.dto.SprintDTO;
import com.licenta.service.dto.TaskDTO;
import com.licenta.service.dto.TeamDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Task} and its DTO {@link TaskDTO}.
 */
@Mapper(componentModel = "spring")
public interface TaskMapper extends EntityMapper<TaskDTO, Task> {
    @Mapping(target = "person", source = "person", qualifiedByName = "personId")
    @Mapping(target = "project", source = "project", qualifiedByName = "projectId")
    @Mapping(target = "sprint", source = "sprint", qualifiedByName = "sprintId")
    @Mapping(target = "team", source = "team", qualifiedByName = "teamId")
    TaskDTO toDto(Task s);

    @Named("personId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PersonDTO toDtoPersonId(Person person);

    @Named("projectId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ProjectDTO toDtoProjectId(Project project);

    @Named("sprintId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    SprintDTO toDtoSprintId(Sprint sprint);

    @Named("teamId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TeamDTO toDtoTeamId(Team team);
}
