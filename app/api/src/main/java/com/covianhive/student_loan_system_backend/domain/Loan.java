package com.covianhive.student_loan_system_backend.domain;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record Loan(Long id, Long studentId, BigDecimal amount, LocalDateTime disbursedAt, String note) {
}
