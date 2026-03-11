package com.covianhive.student_loan_system_backend.domain;

import java.math.BigDecimal;

public record Student(
        Long id,
        String name,
        String studentNumber,
        Long bankId,
        String bankAccount,
        BigDecimal allowanceAmount,
        BigDecimal loanLimit
) {
}
