package com.covianhive.student_loan_system_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record AmountRequest(
        @NotNull @DecimalMin(value = "0.01") BigDecimal amount,
        @Size(max = 255) @Pattern(regexp = "^[^<>]*$", message = "note must not contain angle brackets") String note
) {
}
