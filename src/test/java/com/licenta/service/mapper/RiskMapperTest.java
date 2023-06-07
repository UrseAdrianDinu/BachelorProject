package com.licenta.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RiskMapperTest {

    private RiskMapper riskMapper;

    @BeforeEach
    public void setUp() {
        riskMapper = new RiskMapperImpl();
    }
}
