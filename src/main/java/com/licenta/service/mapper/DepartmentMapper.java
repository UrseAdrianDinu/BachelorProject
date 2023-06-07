package com.licenta.service.mapper;

import com.licenta.domain.Company;
import com.licenta.domain.Department;
import com.licenta.service.dto.CompanyDTO;
import com.licenta.service.dto.DepartmentDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Department} and its DTO {@link DepartmentDTO}.
 */
@Mapper(componentModel = "spring")
public interface DepartmentMapper extends EntityMapper<DepartmentDTO, Department> {
    @Mapping(target = "parentDept", source = "parentDept", qualifiedByName = "departmentId")
    @Mapping(target = "company", source = "company", qualifiedByName = "companyId")
    DepartmentDTO toDto(Department s);

    @Named("departmentId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    DepartmentDTO toDtoDepartmentId(Department department);

    @Named("companyId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    CompanyDTO toDtoCompanyId(Company company);
}
