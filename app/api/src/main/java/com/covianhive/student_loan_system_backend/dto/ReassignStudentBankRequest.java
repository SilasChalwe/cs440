package com.covianhive.student_loan_system_backend.dto;

import jakarta.validation.constraints.NotNull;

public record ReassignStudentBankRequest(@NotNull Long bankId) {
}
