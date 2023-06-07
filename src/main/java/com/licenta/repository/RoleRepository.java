package com.licenta.repository;

import com.licenta.domain.Role;
import com.licenta.domain.enumeration.RoleSeniority;
import javax.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Role entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    boolean existsByNameAndCodeAndSeniority(@NotNull String name, @NotNull String code, RoleSeniority seniority);

    Role findByNameAndCodeAndSeniority(@NotNull String name, @NotNull String code, RoleSeniority seniority);
}
