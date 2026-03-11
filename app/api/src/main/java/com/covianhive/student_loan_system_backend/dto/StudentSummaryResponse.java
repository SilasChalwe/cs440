package com.covianhive.student_loan_system_backend.dto;

import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Bank;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;

import java.util.List;

public record StudentSummaryResponse(Student student, Bank bank, List<Loan> loans, List<Allowance> allowances) {
}
