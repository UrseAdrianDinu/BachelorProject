package com.licenta.repository;

import com.licenta.domain.Risk;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Risk entity.
 */
@SuppressWarnings("unused")
@Repository
public interface RiskRepository extends JpaRepository<Risk, Long> {}
