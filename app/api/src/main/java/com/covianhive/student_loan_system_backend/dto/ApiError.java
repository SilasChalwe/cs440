package com.covianhive.student_loan_system_backend.dto;

import java.time.LocalDateTime;

public record ApiError(LocalDateTime timestamp, int status, String error, String message, String path) {
}
