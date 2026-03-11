package com.covianhive.student_loan_system_backend.domain;

public enum AccessAction {
    LIST_OWN_STUDENTS,
    READ_STUDENT,
    READ_ADMIN_DASHBOARD,
    READ_ACCESS_LOGS,
    READ_TRANSACTIONS,
    PROCESS_ALLOWANCE,
    PROCESS_LOAN,
    CREATE_STUDENT,
    REASSIGN_STUDENT,
    RUN_MONTHLY_ALLOWANCE_BATCH
}
