package com.licenta.service.dto;

import com.licenta.domain.enumeration.ProbabilityValue;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.licenta.domain.Risk} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RiskDTO implements Serializable {

    private Long id;

    private String description;

    private ProbabilityValue probability;

    private String impact;

    private PhaseDTO phase;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProbabilityValue getProbability() {
        return probability;
    }

    public void setProbability(ProbabilityValue probability) {
        this.probability = probability;
    }

    public String getImpact() {
        return impact;
    }

    public void setImpact(String impact) {
        this.impact = impact;
    }

    public PhaseDTO getPhase() {
        return phase;
    }

    public void setPhase(PhaseDTO phase) {
        this.phase = phase;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RiskDTO)) {
            return false;
        }

        RiskDTO riskDTO = (RiskDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, riskDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RiskDTO{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", probability='" + getProbability() + "'" +
            ", impact='" + getImpact() + "'" +
            ", phase=" + getPhase() +
            "}";
    }
}
