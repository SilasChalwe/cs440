package com.covianhive.student_loan_system_backend.controller;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class SystemControllerTest {

    @Test
    void healthShouldReturnUpStatusAndServiceName() {
        SystemController controller = new SystemController();

        Map<String, String> result = controller.health();

        assertEquals("UP", result.get("status"));
        assertEquals("student-loan-system-backend", result.get("service"));
    }
}
