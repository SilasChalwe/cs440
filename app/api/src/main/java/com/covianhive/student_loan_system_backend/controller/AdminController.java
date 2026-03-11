package com.covianhive.student_loan_system_backend.controller;

import com.covianhive.student_loan_system_backend.domain.AccessLogEntry;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.domain.TransactionRecord;
import com.covianhive.student_loan_system_backend.dto.AdminDashboardResponse;
import com.covianhive.student_loan_system_backend.dto.CreateStudentRequest;
import com.covianhive.student_loan_system_backend.dto.MonthlyAllowanceRunResponse;
import com.covianhive.student_loan_system_backend.dto.ReassignStudentBankRequest;
import com.covianhive.student_loan_system_backend.service.AdminService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse getDashboard() {
        return adminService.getDashboard();
    }

    @GetMapping("/access-logs")
    public List<AccessLogEntry> getAccessLogs() {
        return adminService.getAccessLogs();
    }

    @GetMapping("/transactions")
    public List<TransactionRecord> getTransactions() {
        return adminService.getTransactions();
    }

    @PostMapping("/students")
    @ResponseStatus(HttpStatus.CREATED)
    public Student createStudent(@Valid @RequestBody CreateStudentRequest request) {
        return adminService.createStudent(request);
    }

    @PutMapping("/students/{studentId}/bank")
    public Student reassignStudentBank(@PathVariable Long studentId, @Valid @RequestBody ReassignStudentBankRequest request) {
        return adminService.reassignStudentBank(studentId, request);
    }

    @PostMapping("/monthly-allowances/run")
    public MonthlyAllowanceRunResponse runMonthlyAllowances() {
        return adminService.runMonthlyAllowanceBatch();
    }
}
