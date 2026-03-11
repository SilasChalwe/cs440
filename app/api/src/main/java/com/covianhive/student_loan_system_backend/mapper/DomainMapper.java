package com.covianhive.student_loan_system_backend.mapper;

import com.covianhive.student_loan_system_backend.domain.AccessLogEntry;
import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Bank;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.domain.TransactionRecord;
import com.covianhive.student_loan_system_backend.persistence.entity.AccessLogEntryEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.AllowanceEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.BankEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.LoanEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.StudentEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.TransactionRecordEntity;

public final class DomainMapper {

    private DomainMapper() {
    }

    public static Bank toDomain(BankEntity entity) {
        return new Bank(entity.getId(), entity.getCode(), entity.getName());
    }

    public static Student toDomain(StudentEntity entity) {
        return new Student(
                entity.getId(),
                entity.getName(),
                entity.getStudentNumber(),
                entity.getBankId(),
                entity.getBankAccount(),
                entity.getAllowanceAmount(),
                entity.getLoanLimit()
        );
    }

    public static Loan toDomain(LoanEntity entity) {
        return new Loan(entity.getId(), entity.getStudentId(), entity.getAmount(), entity.getDisbursedAt(), entity.getNote());
    }

    public static Allowance toDomain(AllowanceEntity entity) {
        return new Allowance(entity.getId(), entity.getStudentId(), entity.getAmount(), entity.getDisbursedAt(), entity.getNote());
    }

    public static TransactionRecord toDomain(TransactionRecordEntity entity) {
        return new TransactionRecord(
                entity.getId(),
                entity.getType(),
                entity.getStudentId(),
                entity.getBankId(),
                entity.getAmount(),
                entity.getProcessedBy(),
                entity.getProcessedAt(),
                entity.getNote()
        );
    }

    public static AccessLogEntry toDomain(AccessLogEntryEntity entity) {
        return new AccessLogEntry(
                entity.getId(),
                entity.getActor(),
                entity.getRole(),
                entity.getBankId(),
                entity.getStudentId(),
                entity.getAction(),
                entity.getOutcome(),
                entity.getReason(),
                entity.getTimestamp()
        );
    }
}
