package com.covianhive.student_loan_system_backend.dto;

import com.covianhive.student_loan_system_backend.domain.AccessLogEntry;
import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Bank;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.domain.TransactionRecord;

import java.util.List;

public record AdminDashboardResponse(
        List<Bank> banks,
        List<Student> students,
        List<Loan> loans,
        List<Allowance> allowances,
        List<TransactionRecord> transactions,
        List<AccessLogEntry> accessLogs
) {
}
