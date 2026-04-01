package com.covianhive.student_loan_system_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateStudentRequest(
        @NotBlank @Size(max = 120) @Pattern(regexp = "^[^<>]*$", message = "name must not contain angle brackets") String name,
        @NotBlank @Pattern(regexp = "^\\d{8,12}$", message = "studentNumber must be numeric with 8 to 12 digits") String studentNumber,
        @NotNull Long bankId
) {
}
