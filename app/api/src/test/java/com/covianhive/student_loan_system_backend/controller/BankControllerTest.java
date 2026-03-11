package com.covianhive.student_loan_system_backend.controller;

import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.dto.AmountRequest;
import com.covianhive.student_loan_system_backend.service.BankService;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BankControllerTest {

    @Test
    void getMyStudentsShouldReturnStudentsFromService() {
        BankService bankService = mock(BankService.class);
        BankController controller = new BankController(bankService);
        List<Student> expected = List.of(
                new Student(1L, "Ari", "STD-001", 10L, "0000000000000001", new BigDecimal("1000.00"), new BigDecimal("15000.00")),
                new Student(2L, "Bea", "STD-002", 10L, "0000000000000002", new BigDecimal("1000.00"), new BigDecimal("15000.00"))
        );
        when(bankService.getMyStudents()).thenReturn(expected);

        List<Student> result = controller.getMyStudents();

        assertEquals(expected, result);
        verify(bankService).getMyStudents();
    }

    @Test
    void getStudentShouldReturnStudentFromService() {
        BankService bankService = mock(BankService.class);
        BankController controller = new BankController(bankService);
        Student expected = new Student(7L, "Chris", "STD-007", 11L, "0000000000000007", new BigDecimal("1000.00"), new BigDecimal("15000.00"));
        when(bankService.getStudent(7L)).thenReturn(expected);

        Student result = controller.getStudent(7L);

        assertEquals(expected, result);
        verify(bankService).getStudent(7L);
    }

    @Test
    void processLoanShouldDelegateToServiceAndReturnCreatedLoan() {
        BankService bankService = mock(BankService.class);
        BankController controller = new BankController(bankService);
        AmountRequest request = new AmountRequest(new BigDecimal("950.00"), "Semester disbursement");
        Loan expected = new Loan(1L, 5L, new BigDecimal("950.00"), LocalDateTime.of(2026, 2, 25, 10, 0), "Semester disbursement");
        when(bankService.processLoan(5L, request.amount(), request.note())).thenReturn(expected);

        Loan result = controller.processLoan(5L, request);

        assertEquals(expected, result);
        verify(bankService).processLoan(5L, request.amount(), request.note());
    }

    @Test
    void processAllowanceShouldDelegateToServiceAndReturnCreatedAllowance() {
        BankService bankService = mock(BankService.class);
        BankController controller = new BankController(bankService);
        AmountRequest request = new AmountRequest(new BigDecimal("120.00"), "Transport allowance");
        Allowance expected = new Allowance(2L, 5L, new BigDecimal("120.00"), LocalDateTime.of(2026, 2, 25, 11, 0), "Transport allowance");
        when(bankService.processAllowance(5L, request.amount(), request.note())).thenReturn(expected);

        Allowance result = controller.processAllowance(5L, request);

        assertEquals(expected, result);
        verify(bankService).processAllowance(5L, request.amount(), request.note());
    }
}
