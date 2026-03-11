package com.covianhive.student_loan_system_backend.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionRecord(
        Long id,
        TransactionType type,
        Long studentId,
        Long bankId,
        BigDecimal amount,
        String processedBy,
        LocalDateTime processedAt,
        String note
) {
}
