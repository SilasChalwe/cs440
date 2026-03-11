package com.covianhive.student_loan_system_backend.dto;

public record MonthlyAllowanceRunResponse(
        int processedCount,
        int skippedCount,
        String note
) {
}
