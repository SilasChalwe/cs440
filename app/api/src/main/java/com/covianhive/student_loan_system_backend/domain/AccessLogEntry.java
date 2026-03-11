package com.covianhive.student_loan_system_backend.domain;

import java.time.LocalDateTime;

public record AccessLogEntry(
        Long id,
        String actor,
        RoleType role,
        Long bankId,
        Long studentId,
        AccessAction action,
        AccessOutcome outcome,
        String reason,
        LocalDateTime timestamp
) {
}
