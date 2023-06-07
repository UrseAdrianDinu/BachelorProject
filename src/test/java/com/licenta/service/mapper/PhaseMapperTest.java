package com.licenta.service.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class PhaseMapperTest {

    private PhaseMapper phaseMapper;

    @BeforeEach
    public void setUp() {
        phaseMapper = new PhaseMapperImpl();
    }
}
