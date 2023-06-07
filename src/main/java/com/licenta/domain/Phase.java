package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.PhaseStatus;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Phase.
 */
@Entity
@Table(name = "phase")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Phase implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "objective")
    private String objective;

    @Column(name = "description")
    private String description;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "estimated_time")
    private Integer estimatedTime;

    @Column(name = "status")
    private PhaseStatus status;

    @OneToMany(mappedBy = "phase")
    @JsonIgnoreProperties(value = { "phase" }, allowSetters = true)
    private Set<Risk> risks = new HashSet<>();

    @OneToMany(mappedBy = "phase")
    @JsonIgnoreProperties(value = { "tasks", "phase" }, allowSetters = true)
    private Set<Sprint> sprints = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "tasks", "phases", "teams", "company" }, allowSetters = true)
    private Project project;

    public Phase() {}

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Phase id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Phase name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getObjective() {
        return this.objective;
    }

    public Phase objective(String objective) {
        this.setObjective(objective);
        return this;
    }

    public void setObjective(String objective) {
        this.objective = objective;
    }

    public String getDescription() {
        return this.description;
    }

    public Phase description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getStartDate() {
        return this.startDate;
    }

    public Phase startDate(LocalDate startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return this.endDate;
    }

    public Phase endDate(LocalDate endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Integer getEstimatedTime() {
        return this.estimatedTime;
    }

    public Phase estimatedTime(Integer estimatedTime) {
        this.setEstimatedTime(estimatedTime);
        return this;
    }

    public void setEstimatedTime(Integer estimatedTime) {
        this.estimatedTime = estimatedTime;
    }

    public Set<Risk> getRisks() {
        return this.risks;
    }

    public void setRisks(Set<Risk> risks) {
        if (this.risks != null) {
            this.risks.forEach(i -> i.setPhase(null));
        }
        if (risks != null) {
            risks.forEach(i -> i.setPhase(this));
        }
        this.risks = risks;
    }

    public Phase risks(Set<Risk> risks) {
        this.setRisks(risks);
        return this;
    }

    public Phase addRisk(Risk risk) {
        this.risks.add(risk);
        risk.setPhase(this);
        return this;
    }

    public Phase removeRisk(Risk risk) {
        this.risks.remove(risk);
        risk.setPhase(null);
        return this;
    }

    public Set<Sprint> getSprints() {
        return this.sprints;
    }

    public void setSprints(Set<Sprint> sprints) {
        if (this.sprints != null) {
            this.sprints.forEach(i -> i.setPhase(null));
        }
        if (sprints != null) {
            sprints.forEach(i -> i.setPhase(this));
        }
        this.sprints = sprints;
    }

    public Phase sprints(Set<Sprint> sprints) {
        this.setSprints(sprints);
        return this;
    }

    public Phase addSprint(Sprint sprint) {
        this.sprints.add(sprint);
        sprint.setPhase(this);
        return this;
    }

    public Phase removeSprint(Sprint sprint) {
        this.sprints.remove(sprint);
        sprint.setPhase(null);
        return this;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Phase project(Project project) {
        this.setProject(project);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Phase)) {
            return false;
        }
        return id != null && id.equals(((Phase) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Phase{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", objective='" + getObjective() + "'" +
            ", description='" + getDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", estimatedTime=" + getEstimatedTime() +
            "}";
    }

    public PhaseStatus getStatus() {
        return status;
    }

    public void setStatus(PhaseStatus status) {
        this.status = status;
    }
}
