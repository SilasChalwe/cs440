package com.covianhive.student_loan_system_backend.controller;

import com.covianhive.student_loan_system_backend.domain.TransactionRecord;
import com.covianhive.student_loan_system_backend.dto.StudentSummaryResponse;
import com.covianhive.student_loan_system_backend.service.StudentService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/student")
@SecurityRequirement(name = "bearerAuth")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/me")
    public StudentSummaryResponse getMySummary() {
        return studentService.getMySummary();
    }

    @GetMapping("/me/transactions")
    public List<TransactionRecord> getMyTransactions() {
        return studentService.getMyTransactions();
    }
}
