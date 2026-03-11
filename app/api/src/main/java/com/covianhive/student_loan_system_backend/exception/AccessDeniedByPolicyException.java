package com.covianhive.student_loan_system_backend.exception;

public class AccessDeniedByPolicyException extends RuntimeException {
    public AccessDeniedByPolicyException(String message) {
        super(message);
    }
}
