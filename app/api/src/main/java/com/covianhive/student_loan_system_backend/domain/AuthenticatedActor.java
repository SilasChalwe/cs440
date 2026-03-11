package com.covianhive.student_loan_system_backend.domain;

public record AuthenticatedActor(String username, RoleType role, Long bankId, Long studentId) {
}
