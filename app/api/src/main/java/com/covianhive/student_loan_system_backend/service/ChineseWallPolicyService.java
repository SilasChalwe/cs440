package com.covianhive.student_loan_system_backend.service;

import com.covianhive.student_loan_system_backend.domain.AccessAction;
import com.covianhive.student_loan_system_backend.domain.AccessOutcome;
import com.covianhive.student_loan_system_backend.domain.AuthenticatedActor;
import com.covianhive.student_loan_system_backend.domain.RoleType;
import com.covianhive.student_loan_system_backend.domain.Student;
import com.covianhive.student_loan_system_backend.exception.AccessDeniedByPolicyException;
import com.covianhive.student_loan_system_backend.persistence.entity.AccessLogEntryEntity;
import com.covianhive.student_loan_system_backend.repository.AccessLogEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ChineseWallPolicyService {

    private final AccessLogEntryRepository accessLogEntryRepository;
    private final ActorContextService actorContextService;

    public ChineseWallPolicyService(AccessLogEntryRepository accessLogEntryRepository, ActorContextService actorContextService) {
        this.accessLogEntryRepository = accessLogEntryRepository;
        this.actorContextService = actorContextService;
    }

    public AuthenticatedActor validateBankCanAccessStudent(Student student, AccessAction action) {
        AuthenticatedActor actor = actorContextService.currentActor();
        if (actor.role() != RoleType.BANK) {
            throw new AccessDeniedByPolicyException("Only bank actors can perform this action.");
        }

        if (!student.bankId().equals(actor.bankId())) {
            log(actor, student.id(), action, AccessOutcome.DENIED,
                    "Chinese Wall violation: bank cannot access students from another bank.");
            throw new AccessDeniedByPolicyException("Access blocked by Chinese Wall policy.");
        }

        log(actor, student.id(), action, AccessOutcome.ALLOWED, "Access granted.");
        return actor;
    }

    public void logStudentSelfAccess(Long studentId, AccessAction action, AccessOutcome outcome, String reason) {
        AuthenticatedActor actor = actorContextService.currentActor();
        log(actor, studentId, action, outcome, reason);
    }

    public void logAdminAccess(Long studentId, AccessAction action, AccessOutcome outcome, String reason) {
        AuthenticatedActor actor = actorContextService.currentActor();
        log(actor, studentId, action, outcome, reason);
    }

    public void logActorAccess(Long studentId, AccessAction action, AccessOutcome outcome, String reason) {
        AuthenticatedActor actor = actorContextService.currentActor();
        log(actor, studentId, action, outcome, reason);
    }

    private void log(AuthenticatedActor actor, Long studentId, AccessAction action, AccessOutcome outcome, String reason) {
        accessLogEntryRepository.save(new AccessLogEntryEntity(
                null,
                actor.username(),
                actor.role(),
                actor.bankId(),
                studentId,
                action,
                outcome,
                reason,
                LocalDateTime.now()
        ));
    }
}
