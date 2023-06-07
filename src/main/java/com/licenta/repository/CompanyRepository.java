package com.licenta.repository;

import com.licenta.domain.Company;
import java.util.Optional;
import javax.swing.text.html.Option;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Company entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {}
