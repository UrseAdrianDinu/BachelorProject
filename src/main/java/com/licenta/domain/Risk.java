package com.licenta.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.licenta.domain.enumeration.ProbabilityValue;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Risk.
 */
@Entity
@Table(name = "risk")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Risk implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "probability")
    private ProbabilityValue probability;

    @Column(name = "impact")
    private String impact;

    @ManyToOne
    @JsonIgnoreProperties(value = { "risks", "sprints", "project" }, allowSetters = true)
    private Phase phase;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Risk id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Risk description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProbabilityValue getProbability() {
        return this.probability;
    }

    public Risk probability(ProbabilityValue probability) {
        this.setProbability(probability);
        return this;
    }

    public void setProbability(ProbabilityValue probability) {
        this.probability = probability;
    }

    public String getImpact() {
        return this.impact;
    }

    public Risk impact(String impact) {
        this.setImpact(impact);
        return this;
    }

    public void setImpact(String impact) {
        this.impact = impact;
    }

    public Phase getPhase() {
        return this.phase;
    }

    public void setPhase(Phase phase) {
        this.phase = phase;
    }

    public Risk phase(Phase phase) {
        this.setPhase(phase);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Risk)) {
            return false;
        }
        return id != null && id.equals(((Risk) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Risk{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", probability='" + getProbability() + "'" +
            ", impact='" + getImpact() + "'" +
            "}";
    }
}
