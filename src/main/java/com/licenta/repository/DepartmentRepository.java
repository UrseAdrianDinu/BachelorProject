package com.licenta.repository;

import com.licenta.domain.Company;
import com.licenta.domain.Department;
import java.util.Optional;
import javax.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Department entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findDepartmentByName(String name);
    Optional<Department> findDepartmentByNameAndCompany(@NotNull String name, Company company);
}
