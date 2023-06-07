package com.licenta.repository;

import com.licenta.domain.Phase;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Phase entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PhaseRepository extends JpaRepository<Phase, Long> {}
