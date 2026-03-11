package com.covianhive.student_loan_system_backend.controller;

import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Bank;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.domain.TransactionRecord;
import com.covianhive.student_loan_system_backend.domain.TransactionType;
import com.covianhive.student_loan_system_backend.dto.StudentSummaryResponse;
import com.covianhive.student_loan_system_backend.service.StudentService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class StudentControllerTest {

    @Test
    void getMySummaryShouldReturnSummaryFromService() {
        StudentService studentService = mock(StudentService.class);
        StudentController controller = new StudentController(studentService);
        StudentSummaryResponse expected = new StudentSummaryResponse(
                new Student(1L, "Ari", "STD-001", 10L, "0000000000000001", new BigDecimal("1000.00"), new BigDecimal("15000.00")),
                new Bank(10L, "BNK-A", "Bank A"),
                List.of(new Loan(1L, 1L, new BigDecimal("900.00"), LocalDateTime.of(2026, 2, 25, 9, 0), "Loan")),
                List.of(new Allowance(2L, 1L, new BigDecimal("100.00"), LocalDateTime.of(2026, 2, 25, 9, 30), "Allowance"))
        );
        when(studentService.getMySummary()).thenReturn(expected);

        StudentSummaryResponse result = controller.getMySummary();

        assertEquals(expected, result);
        verify(studentService).getMySummary();
    }

    @Test
    void getMyTransactionsShouldReturnTransactionsFromService() {
        StudentService studentService = mock(StudentService.class);
        StudentController controller = new StudentController(studentService);
        List<TransactionRecord> expected = List.of(
                new TransactionRecord(
                        1L,
                        TransactionType.LOAN_DISBURSEMENT,
                        1L,
                        10L,
                        new BigDecimal("900.00"),
                        "bank_user",
                        LocalDateTime.of(2026, 2, 25, 10, 0),
                        "Loan"
                )
        );
        when(studentService.getMyTransactions()).thenReturn(expected);

        List<TransactionRecord> result = controller.getMyTransactions();

        assertEquals(expected, result);
        verify(studentService).getMyTransactions();
    }
}
