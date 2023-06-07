package com.licenta.repository;

import com.licenta.domain.Sprint;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Sprint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {}
