package com.covianhive.student_loan_system_backend.service;

import com.covianhive.student_loan_system_backend.domain.TransactionType;
import com.covianhive.student_loan_system_backend.dto.MonthlyAllowanceRunResponse;
import com.covianhive.student_loan_system_backend.persistence.entity.AllowanceEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.StudentEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.TransactionRecordEntity;
import com.covianhive.student_loan_system_backend.repository.AllowanceRepository;
import com.covianhive.student_loan_system_backend.repository.StudentRepository;
import com.covianhive.student_loan_system_backend.repository.TransactionRecordRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class MonthlyAllowanceService {

    private final StudentRepository studentRepository;
    private final AllowanceRepository allowanceRepository;
    private final TransactionRecordRepository transactionRecordRepository;
    private final BigDecimal monthlyAmount;
    private final String monthlyNote;

    public MonthlyAllowanceService(
            StudentRepository studentRepository,
            AllowanceRepository allowanceRepository,
            TransactionRecordRepository transactionRecordRepository,
            @Value("${app.allowance.monthly-amount:1500.00}") BigDecimal monthlyAmount,
            @Value("${app.allowance.monthly-note:Monthly allowance disbursement}") String monthlyNote
    ) {
        this.studentRepository = studentRepository;
        this.allowanceRepository = allowanceRepository;
        this.transactionRecordRepository = transactionRecordRepository;
        this.monthlyAmount = monthlyAmount;
        this.monthlyNote = monthlyNote;
    }

    @Transactional
    public MonthlyAllowanceRunResponse runCurrentMonthDisbursement(String processedBy) {
        LocalDate currentDate = LocalDate.now();
        LocalDateTime startOfMonth = currentDate.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = currentDate.withDayOfMonth(currentDate.lengthOfMonth()).atTime(LocalTime.MAX);
        LocalDateTime now = LocalDateTime.now();

        int processed = 0;
        int skipped = 0;

        for (StudentEntity student : studentRepository.findAll()) {
            boolean alreadyDisbursed = allowanceRepository.existsByStudentIdAndDisbursedAtBetween(
                    student.getId(),
                    startOfMonth,
                    endOfMonth
            );

            if (alreadyDisbursed) {
                skipped++;
                continue;
            }

            allowanceRepository.save(new AllowanceEntity(
                    null,
                    student.getId(),
                    monthlyAmount,
                    now,
                    monthlyNote
            ));

            transactionRecordRepository.save(new TransactionRecordEntity(
                    null,
                    TransactionType.ALLOWANCE_DISBURSEMENT,
                    student.getId(),
                    student.getBankId(),
                    monthlyAmount,
                    processedBy,
                    now,
                    monthlyNote
            ));

            processed++;
        }

        return new MonthlyAllowanceRunResponse(processed, skipped, monthlyNote);
    }
}
