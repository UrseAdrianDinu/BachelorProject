package com.licenta.service;

import com.licenta.domain.Company;
import com.licenta.domain.Department;
import com.licenta.repository.CompanyRepository;
import com.licenta.repository.DepartmentRepository;
import com.licenta.service.dto.DepartmentCreateDTO;
import com.licenta.service.dto.DepartmentDTO;
import com.licenta.service.mapper.DepartmentMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Department}.
 */
@Service
@Transactional
public class DepartmentService {

    private final Logger log = LoggerFactory.getLogger(DepartmentService.class);

    private final DepartmentRepository departmentRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentMapper departmentMapper;

    public DepartmentService(
        DepartmentRepository departmentRepository,
        CompanyRepository companyRepository,
        DepartmentMapper departmentMapper
    ) {
        this.departmentRepository = departmentRepository;
        this.companyRepository = companyRepository;
        this.departmentMapper = departmentMapper;
    }

    /**
     * Save a department.
     *
     * @param departmentDTO the entity to save.
     * @return the persisted entity.
     */
    public DepartmentDTO save(DepartmentDTO departmentDTO) {
        log.debug("Request to save Department : {}", departmentDTO);
        Department department = departmentMapper.toEntity(departmentDTO);
        department = departmentRepository.save(department);
        return departmentMapper.toDto(department);
    }

    /**
     * Save a department.
     *
     * @param departmentCreateDTO the entity to save.
     * @return the persisted entity.
     */
    public DepartmentDTO saveDepartmentAndAddCompany(DepartmentCreateDTO departmentCreateDTO, Long id) {
        log.debug("Request to save Department : {}", departmentCreateDTO);
        Department department = new Department();
        department.setName(departmentCreateDTO.getName());
        department.setCode(departmentCreateDTO.getCode());
        department.setEmail(departmentCreateDTO.getEmail());
        department.setDescription(departmentCreateDTO.getDescription());
        department.setParentDept(null);
        Optional<Company> optionalCompany = companyRepository.findById(id);
        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            department.setCompany(company);
        }
        department = departmentRepository.save(department);
        return departmentMapper.toDto(department);
    }

    /**
     * Update a department.
     *
     * @param departmentDTO the entity to save.
     * @return the persisted entity.
     */
    public DepartmentDTO update(DepartmentDTO departmentDTO) {
        log.debug("Request to update Department : {}", departmentDTO);
        Department department = departmentMapper.toEntity(departmentDTO);
        department = departmentRepository.save(department);
        return departmentMapper.toDto(department);
    }

    /**
     * Partially update a department.
     *
     * @param departmentDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<DepartmentDTO> partialUpdate(DepartmentDTO departmentDTO) {
        log.debug("Request to partially update Department : {}", departmentDTO);

        return departmentRepository
            .findById(departmentDTO.getId())
            .map(existingDepartment -> {
                departmentMapper.partialUpdate(existingDepartment, departmentDTO);

                return existingDepartment;
            })
            .map(departmentRepository::save)
            .map(departmentMapper::toDto);
    }

    /**
     * Get all the departments.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<DepartmentDTO> findAll() {
        log.debug("Request to get all Departments");
        return departmentRepository.findAll().stream().map(departmentMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one department by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<DepartmentDTO> findOne(Long id) {
        log.debug("Request to get Department : {}", id);
        return departmentRepository.findById(id).map(departmentMapper::toDto);
    }

    public Optional<DepartmentDTO> findDepartmentByNameAndCompany(String name, Company company) {
        log.debug("Request to get Department : {}", name);
        return departmentRepository.findDepartmentByNameAndCompany(name, company).map(departmentMapper::toDto);
    }

    /**
     * Delete the department by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Department : {}", id);
        departmentRepository.deleteById(id);
    }
}
