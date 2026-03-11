package com.covianhive.student_loan_system_backend.service;

import com.covianhive.student_loan_system_backend.domain.AccessAction;
import com.covianhive.student_loan_system_backend.domain.AccessOutcome;
import com.covianhive.student_loan_system_backend.domain.Allowance;
import com.covianhive.student_loan_system_backend.domain.Bank;
import com.covianhive.student_loan_system_backend.domain.AuthenticatedActor;
import com.covianhive.student_loan_system_backend.domain.Loan;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.domain.TransactionType;
import com.covianhive.student_loan_system_backend.dto.StudentSummaryResponse;
import com.covianhive.student_loan_system_backend.exception.NotFoundException;
import com.covianhive.student_loan_system_backend.mapper.DomainMapper;
import com.covianhive.student_loan_system_backend.persistence.entity.AllowanceEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.LoanEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.StudentEntity;
import com.covianhive.student_loan_system_backend.persistence.entity.TransactionRecordEntity;
import com.covianhive.student_loan_system_backend.repository.AllowanceRepository;
import com.covianhive.student_loan_system_backend.repository.BankRepository;
import com.covianhive.student_loan_system_backend.repository.LoanRepository;
import com.covianhive.student_loan_system_backend.repository.StudentRepository;
import com.covianhive.student_loan_system_backend.repository.TransactionRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BankService {

    private final StudentRepository studentRepository;
    private final BankRepository bankRepository;
    private final LoanRepository loanRepository;
    private final AllowanceRepository allowanceRepository;
    private final TransactionRecordRepository transactionRecordRepository;
    private final ActorContextService actorContextService;
    private final ChineseWallPolicyService chineseWallPolicyService;

    public BankService(
            StudentRepository studentRepository,
            BankRepository bankRepository,
            LoanRepository loanRepository,
            AllowanceRepository allowanceRepository,
            TransactionRecordRepository transactionRecordRepository,
            ActorContextService actorContextService,
            ChineseWallPolicyService chineseWallPolicyService
    ) {
        this.studentRepository = studentRepository;
        this.bankRepository = bankRepository;
        this.loanRepository = loanRepository;
        this.allowanceRepository = allowanceRepository;
        this.transactionRecordRepository = transactionRecordRepository;
        this.actorContextService = actorContextService;
        this.chineseWallPolicyService = chineseWallPolicyService;
    }

    public List<Student> getMyStudents() {
        AuthenticatedActor actor = actorContextService.currentActor();
        List<Student> students = studentRepository.findByBankIdOrderByIdAsc(actor.bankId()).stream().map(DomainMapper::toDomain).toList();
        for (Student student : students) {
            chineseWallPolicyService.logActorAccess(
                    student.id(),
                    AccessAction.LIST_OWN_STUDENTS,
                    AccessOutcome.ALLOWED,
                    "Bank listed own students."
            );
        }
        return students;
    }

    public Student getStudent(Long studentId) {
        StudentEntity studentEntity = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found."));
        Student student = DomainMapper.toDomain(studentEntity);
        chineseWallPolicyService.validateBankCanAccessStudent(student, AccessAction.READ_STUDENT);
        return student;
    }

    public StudentSummaryResponse getStudentSummary(Long studentId) {
        StudentEntity studentEntity = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found."));
        Student student = DomainMapper.toDomain(studentEntity);

        chineseWallPolicyService.validateBankCanAccessStudent(student, AccessAction.READ_STUDENT);

        Bank bank = bankRepository.findById(student.bankId())
                .map(DomainMapper::toDomain)
                .orElseThrow(() -> new NotFoundException("Bank not found."));

        var loans = loanRepository.findByStudentIdOrderByIdAsc(studentId).stream()
                .map(DomainMapper::toDomain)
                .toList();
        var allowances = allowanceRepository.findByStudentIdOrderByIdAsc(studentId).stream()
                .map(DomainMapper::toDomain)
                .toList();

        return new StudentSummaryResponse(student, bank, loans, allowances);
    }

    public Bank getMyBank() {
        AuthenticatedActor actor = actorContextService.currentActor();
        if (actor.bankId() == null) {
            throw new NotFoundException("Bank not found.");
        }

        return bankRepository.findById(actor.bankId())
                .map(DomainMapper::toDomain)
                .orElseThrow(() -> new NotFoundException("Bank not found."));
    }

    @Transactional
    public Loan processLoan(Long studentId, BigDecimal amount, String note) {
        StudentEntity studentEntity = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found."));
        Student student = DomainMapper.toDomain(studentEntity);

        AuthenticatedActor actor = chineseWallPolicyService
                .validateBankCanAccessStudent(student, AccessAction.PROCESS_LOAN);

        LoanEntity savedLoan = loanRepository.save(new LoanEntity(null, studentId, amount, LocalDateTime.now(), note));

        transactionRecordRepository.save(new TransactionRecordEntity(
                null,
                TransactionType.LOAN_DISBURSEMENT,
                studentId,
                actor.bankId(),
                amount,
                actor.username(),
                LocalDateTime.now(),
                note
        ));

        return DomainMapper.toDomain(savedLoan);
    }

    @Transactional
    public Allowance processAllowance(Long studentId, BigDecimal amount, String note) {
        StudentEntity studentEntity = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found."));
        Student student = DomainMapper.toDomain(studentEntity);

        AuthenticatedActor actor = chineseWallPolicyService
                .validateBankCanAccessStudent(student, AccessAction.PROCESS_ALLOWANCE);

        AllowanceEntity savedAllowance = allowanceRepository.save(new AllowanceEntity(null, studentId, amount, LocalDateTime.now(), note));

        transactionRecordRepository.save(new TransactionRecordEntity(
                null,
                TransactionType.ALLOWANCE_DISBURSEMENT,
                studentId,
                actor.bankId(),
                amount,
                actor.username(),
                LocalDateTime.now(),
                note
        ));

        return DomainMapper.toDomain(savedAllowance);
    }
}
