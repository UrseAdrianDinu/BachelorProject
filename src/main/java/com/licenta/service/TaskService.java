package com.licenta.service;

import com.licenta.domain.Person;
import com.licenta.domain.Project;
import com.licenta.domain.Sprint;
import com.licenta.domain.Task;
import com.licenta.domain.enumeration.TaskStatus;
import com.licenta.repository.PersonRepository;
import com.licenta.repository.ProjectRepository;
import com.licenta.repository.SprintRepository;
import com.licenta.repository.TaskRepository;
import com.licenta.service.dto.TaskDTO;
import com.licenta.service.dto.TaskEditDTO;
import com.licenta.service.mapper.TaskMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Task}.
 */
@Service
@Transactional
public class TaskService {

    private final Logger log = LoggerFactory.getLogger(TaskService.class);

    private final TaskRepository taskRepository;
    private final SprintRepository sprintRepository;
    private final PersonRepository personRepository;
    private final ProjectRepository projectRepository;
    private final TaskMapper taskMapper;

    public TaskService(
        TaskRepository taskRepository,
        SprintRepository sprintRepository,
        PersonRepository personRepository,
        ProjectRepository projectRepository,
        TaskMapper taskMapper
    ) {
        this.taskRepository = taskRepository;
        this.sprintRepository = sprintRepository;
        this.personRepository = personRepository;
        this.projectRepository = projectRepository;
        this.taskMapper = taskMapper;
    }

    /**
     * Save a task.
     *
     * @param taskDTO the entity to save.
     * @return the persisted entity.
     */
    public TaskDTO save(TaskDTO taskDTO) {
        log.debug("Request to save Task : {}", taskDTO);
        Task task = taskMapper.toEntity(taskDTO);
        task = taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    public TaskDTO saveTaskAndSprintAndPerson(TaskDTO taskDTO, Long projectId, Long sprintId, Long personId) {
        log.debug("Request to save Task : {}", taskDTO);
        Task task = taskMapper.toEntity(taskDTO);
        task.setStatus(TaskStatus.TODO);
        task = taskRepository.save(task);
        Optional<Person> personOptional = personRepository.findById(personId);
        Optional<Sprint> sprintOptional = sprintRepository.findById(sprintId);
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (personOptional.isPresent() && sprintOptional.isPresent() && projectOptional.isPresent()) {
            Person person = personOptional.get();
            Sprint sprint = sprintOptional.get();
            Project project = projectOptional.get();
            task.setPerson(person);
            String lastName = person.getUser().getLastName();
            String firstName = person.getUser().getFirstName();
            task.setAssignee(lastName + " " + firstName + "(" + person.getCode() + ")");
            task.setSprint(sprint);
            task.setProject(project);
        }
        task = taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    /**
     * Update a task.
     *
     * @param taskDTO the entity to save.
     * @return the persisted entity.
     */
    public TaskDTO update(TaskDTO taskDTO) {
        log.debug("Request to update Task : {}", taskDTO);
        Task task = taskMapper.toEntity(taskDTO);
        task = taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    /**
     * Partially update a task.
     *
     * @param taskDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<TaskDTO> partialUpdate(TaskDTO taskDTO) {
        log.debug("Request to partially update Task : {}", taskDTO);

        return taskRepository
            .findById(taskDTO.getId())
            .map(existingTask -> {
                taskMapper.partialUpdate(existingTask, taskDTO);

                return existingTask;
            })
            .map(taskRepository::save)
            .map(taskMapper::toDto);
    }

    public TaskDTO editTask(TaskEditDTO taskEditDTO, Long taskId, Long personId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        Optional<Person> personOptional = personRepository.findById(personId);
        if (taskOptional.isPresent() && personOptional.isPresent()) {
            Task task = taskOptional.get();
            Person person = personOptional.get();
            task.setTitle(taskEditDTO.getTitle());
            task.setDescription(taskEditDTO.getDescription());
            task.setEstimatedTime(taskEditDTO.getEstimatedTime());
            task.setTimeLogged(taskEditDTO.getTimeLogged());
            task.setStoryPoints(taskEditDTO.getStoryPoints());
            task.setPriority(taskEditDTO.getPriority());
            task.setStatus(taskEditDTO.getStatus());
            String lastName = person.getUser().getLastName();
            String firstName = person.getUser().getFirstName();
            task.setAssignee(lastName + " " + firstName + "(" + person.getCode() + ")");
            task.setPerson(person);
            task.setReporter(taskEditDTO.getReporter());
            task = taskRepository.save(task);
            return taskMapper.toDto(task);
        }
        return null;
    }

    /**
     * Get all the tasks.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<TaskDTO> findAll() {
        log.debug("Request to get all Tasks");
        return taskRepository.findAll().stream().map(taskMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one task by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<TaskDTO> findOne(Long id) {
        log.debug("Request to get Task : {}", id);
        return taskRepository.findById(id).map(taskMapper::toDto);
    }

    /**
     * Delete the task by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Task : {}", id);
        taskRepository.deleteById(id);
    }
}
