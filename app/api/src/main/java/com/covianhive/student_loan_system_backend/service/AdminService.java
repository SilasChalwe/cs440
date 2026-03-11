package com.covianhive.student_loan_system_backend.service;

import com.covianhive.student_loan_system_backend.domain.AccessAction;
import com.covianhive.student_loan_system_backend.domain.AccessLogEntry;
import com.covianhive.student_loan_system_backend.domain.AccessOutcome;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.domain.TransactionRecord;
import com.covianhive.student_loan_system_backend.dto.CreateStudentRequest;
import com.covianhive.student_loan_system_backend.dto.AdminDashboardResponse;
import com.covianhive.student_loan_system_backend.dto.MonthlyAllowanceRunResponse;
import com.covianhive.student_loan_system_backend.dto.ReassignStudentBankRequest;
import com.covianhive.student_loan_system_backend.exception.NotFoundException;
import com.covianhive.student_loan_system_backend.mapper.DomainMapper;
import com.covianhive.student_loan_system_backend.persistence.entity.StudentEntity;
import com.covianhive.student_loan_system_backend.repository.AccessLogEntryRepository;
import com.covianhive.student_loan_system_backend.repository.AllowanceRepository;
import com.covianhive.student_loan_system_backend.repository.BankRepository;
import com.covianhive.student_loan_system_backend.repository.LoanRepository;
import com.covianhive.student_loan_system_backend.repository.StudentRepository;
import com.covianhive.student_loan_system_backend.repository.TransactionRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AdminService {

    private static final BigDecimal DEFAULT_ALLOWANCE_AMOUNT = BigDecimal.valueOf(1000);
    private static final BigDecimal DEFAULT_LOAN_LIMIT = BigDecimal.valueOf(15000);

    private final BankRepository bankRepository;
    private final StudentRepository studentRepository;
    private final LoanRepository loanRepository;
    private final AllowanceRepository allowanceRepository;
    private final TransactionRecordRepository transactionRecordRepository;
    private final AccessLogEntryRepository accessLogEntryRepository;
    private final ChineseWallPolicyService chineseWallPolicyService;
    private final MonthlyAllowanceService monthlyAllowanceService;

    public AdminService(
            BankRepository bankRepository,
            StudentRepository studentRepository,
            LoanRepository loanRepository,
            AllowanceRepository allowanceRepository,
            TransactionRecordRepository transactionRecordRepository,
            AccessLogEntryRepository accessLogEntryRepository,
            ChineseWallPolicyService chineseWallPolicyService,
            MonthlyAllowanceService monthlyAllowanceService
    ) {
        this.bankRepository = bankRepository;
        this.studentRepository = studentRepository;
        this.loanRepository = loanRepository;
        this.allowanceRepository = allowanceRepository;
        this.transactionRecordRepository = transactionRecordRepository;
        this.accessLogEntryRepository = accessLogEntryRepository;
        this.chineseWallPolicyService = chineseWallPolicyService;
        this.monthlyAllowanceService = monthlyAllowanceService;
    }

    public AdminDashboardResponse getDashboard() {
        chineseWallPolicyService.logAdminAccess(
                null,
                AccessAction.READ_ADMIN_DASHBOARD,
                AccessOutcome.ALLOWED,
                "Admin viewed dashboard."
        );

        return new AdminDashboardResponse(
                bankRepository.findAll().stream().map(DomainMapper::toDomain).toList(),
                studentRepository.findAll().stream().map(DomainMapper::toDomain).toList(),
                loanRepository.findAll().stream().map(DomainMapper::toDomain).toList(),
                allowanceRepository.findAll().stream().map(DomainMapper::toDomain).toList(),
                transactionRecordRepository.findAll().stream().map(DomainMapper::toDomain).toList(),
                accessLogEntryRepository.findAll().stream().map(DomainMapper::toDomain).toList()
        );
    }

    public List<AccessLogEntry> getAccessLogs() {
        chineseWallPolicyService.logAdminAccess(
                null,
                AccessAction.READ_ACCESS_LOGS,
                AccessOutcome.ALLOWED,
                "Admin viewed access logs."
        );
        return accessLogEntryRepository.findAll().stream().map(DomainMapper::toDomain).toList();
    }

    public List<TransactionRecord> getTransactions() {
        chineseWallPolicyService.logAdminAccess(
                null,
                AccessAction.READ_TRANSACTIONS,
                AccessOutcome.ALLOWED,
                "Admin viewed transactions."
        );
        return transactionRecordRepository.findAll().stream().map(DomainMapper::toDomain).toList();
    }

    @Transactional
    public Student createStudent(CreateStudentRequest request) {
        if (studentRepository.existsById(request.id())) {
            throw new IllegalArgumentException("Student id already exists.");
        }
        if (studentRepository.findByStudentNumberIgnoreCase(request.studentNumber()).isPresent()) {
            throw new IllegalArgumentException("Student number already exists.");
        }
        if (bankRepository.findById(request.bankId()).isEmpty()) {
            throw new NotFoundException("Bank not found.");
        }

        StudentEntity saved = studentRepository.save(new StudentEntity(
                request.id(),
                request.name(),
                request.studentNumber(),
                request.bankId(),
                DEFAULT_ALLOWANCE_AMOUNT,
                DEFAULT_LOAN_LIMIT,
                buildBankAccount(request.id())
        ));

        chineseWallPolicyService.logAdminAccess(
                saved.getId(),
                AccessAction.CREATE_STUDENT,
                AccessOutcome.ALLOWED,
                "Admin created student and assigned bank."
        );

        return DomainMapper.toDomain(saved);
    }

    private String buildBankAccount(Long studentId) {
        return String.format("%016d", studentId);
    }

    @Transactional
    public Student reassignStudentBank(Long studentId, ReassignStudentBankRequest request) {
        StudentEntity studentEntity = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found."));
        if (bankRepository.findById(request.bankId()).isEmpty()) {
            throw new NotFoundException("Bank not found.");
        }

        studentEntity.setBankId(request.bankId());
        StudentEntity saved = studentRepository.save(studentEntity);

        chineseWallPolicyService.logAdminAccess(
                studentId,
                AccessAction.REASSIGN_STUDENT,
                AccessOutcome.ALLOWED,
                "Admin reassigned student to another bank."
        );

        return DomainMapper.toDomain(saved);
    }

    @Transactional
    public MonthlyAllowanceRunResponse runMonthlyAllowanceBatch() {
        chineseWallPolicyService.logAdminAccess(
                null,
                AccessAction.RUN_MONTHLY_ALLOWANCE_BATCH,
                AccessOutcome.ALLOWED,
                "Admin triggered monthly allowance batch."
        );
        return monthlyAllowanceService.runCurrentMonthDisbursement("admin_batch");
    }
}
