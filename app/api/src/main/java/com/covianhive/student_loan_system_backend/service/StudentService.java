package com.covianhive.student_loan_system_backend.service;

import com.covianhive.student_loan_system_backend.domain.AccessAction;
import com.covianhive.student_loan_system_backend.domain.AccessOutcome;
import com.covianhive.student_loan_system_backend.domain.AuthenticatedActor;
import com.covianhive.student_loan_system_backend.domain.TransactionRecord;
import com.covianhive.student_loan_system_backend.dto.StudentSummaryResponse;
import com.covianhive.student_loan_system_backend.exception.NotFoundException;
import com.covianhive.student_loan_system_backend.mapper.DomainMapper;
import com.covianhive.student_loan_system_backend.repository.AllowanceRepository;
import com.covianhive.student_loan_system_backend.repository.BankRepository;
import com.covianhive.student_loan_system_backend.repository.LoanRepository;
import com.covianhive.student_loan_system_backend.repository.StudentRepository;
import com.covianhive.student_loan_system_backend.repository.TransactionRecordRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final BankRepository bankRepository;
    private final LoanRepository loanRepository;
    private final AllowanceRepository allowanceRepository;
    private final TransactionRecordRepository transactionRecordRepository;
    private final ActorContextService actorContextService;
    private final ChineseWallPolicyService chineseWallPolicyService;

    public StudentService(
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

    public StudentSummaryResponse getMySummary() {
        AuthenticatedActor actor = actorContextService.currentActor();
        Long studentId = actor.studentId();

        var student = studentRepository.findById(studentId)
                .map(DomainMapper::toDomain)
                .orElseThrow(() -> new NotFoundException("Student not found."));
        var bank = bankRepository.findById(student.bankId())
                .map(DomainMapper::toDomain)
                .orElseThrow(() -> new NotFoundException("Bank not found."));

        chineseWallPolicyService.logStudentSelfAccess(
                studentId,
                AccessAction.READ_STUDENT,
                AccessOutcome.ALLOWED,
                "Student viewed own record."
        );

        return new StudentSummaryResponse(
                student,
                bank,
                loanRepository.findByStudentIdOrderByIdAsc(studentId).stream().map(DomainMapper::toDomain).toList(),
                allowanceRepository.findByStudentIdOrderByIdAsc(studentId).stream().map(DomainMapper::toDomain).toList()
        );
    }

    public List<TransactionRecord> getMyTransactions() {
        AuthenticatedActor actor = actorContextService.currentActor();
        return transactionRecordRepository.findByStudentIdOrderByIdAsc(actor.studentId()).stream().map(DomainMapper::toDomain).toList();
    }
}
