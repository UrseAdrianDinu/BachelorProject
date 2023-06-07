package com.licenta.service.mapper;

import com.licenta.domain.Department;
import com.licenta.domain.Person;
import com.licenta.domain.Role;
import com.licenta.domain.Team;
import com.licenta.domain.User;
import com.licenta.service.dto.DepartmentDTO;
import com.licenta.service.dto.PersonDTO;
import com.licenta.service.dto.RoleDTO;
import com.licenta.service.dto.TeamDTO;
import com.licenta.service.dto.UserDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Person} and its DTO {@link PersonDTO}.
 */
@Mapper(componentModel = "spring")
public interface PersonMapper extends EntityMapper<PersonDTO, Person> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    @Mapping(target = "manager", source = "manager", qualifiedByName = "personId")
    @Mapping(target = "teams", source = "teams", qualifiedByName = "teamIdSet")
    @Mapping(target = "department", source = "department", qualifiedByName = "departmentId")
    @Mapping(target = "role", source = "role", qualifiedByName = "roleId")
    PersonDTO toDto(Person s);

    @Mapping(target = "removeTeam", ignore = true)
    Person toEntity(PersonDTO personDTO);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);

    @Named("personId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PersonDTO toDtoPersonId(Person person);

    @Named("teamId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    TeamDTO toDtoTeamId(Team team);

    @Named("teamIdSet")
    default Set<TeamDTO> toDtoTeamIdSet(Set<Team> team) {
        return team.stream().map(this::toDtoTeamId).collect(Collectors.toSet());
    }

    @Named("departmentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DepartmentDTO toDtoDepartmentId(Department department);

    @Named("roleId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    RoleDTO toDtoRoleId(Role role);
}
