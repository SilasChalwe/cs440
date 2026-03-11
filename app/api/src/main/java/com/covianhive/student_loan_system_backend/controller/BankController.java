package com.covianhive.student_loan_system_backend.controller;

import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Bank;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.dto.AmountRequest;
import com.covianhive.student_loan_system_backend.dto.StudentSummaryResponse;
import com.covianhive.student_loan_system_backend.service.BankService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bank")
@SecurityRequirement(name = "bearerAuth")
public class BankController {

    private final BankService bankService;

    public BankController(BankService bankService) {
        this.bankService = bankService;
    }

    @GetMapping("/students")
    public List<Student> getMyStudents() {
        return bankService.getMyStudents();
    }

    @GetMapping("/profile")
    public Bank getMyBankProfile() {
        return bankService.getMyBank();
    }

    @GetMapping("/students/{studentId}")
    public Student getStudent(@PathVariable Long studentId) {
        return bankService.getStudent(studentId);
    }

    @GetMapping("/students/{studentId}/summary")
    public StudentSummaryResponse getStudentSummary(@PathVariable Long studentId) {
        return bankService.getStudentSummary(studentId);
    }

    @PostMapping("/students/{studentId}/loans")
    @ResponseStatus(HttpStatus.CREATED)
    public Loan processLoan(@PathVariable Long studentId, @Valid @RequestBody AmountRequest request) {
        return bankService.processLoan(studentId, request.amount(), request.note());
    }

    @PostMapping("/students/{studentId}/allowances")
    @ResponseStatus(HttpStatus.CREATED)
    public Allowance processAllowance(@PathVariable Long studentId, @Valid @RequestBody AmountRequest request) {
        return bankService.processAllowance(studentId, request.amount(), request.note());
    }
}
