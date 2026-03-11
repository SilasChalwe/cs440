package com.covianhive.student_loan_system_backend.persistence.entity;

import com.covianhive.student_loan_system_backend.domain.AccessAction;
import com.covianhive.student_loan_system_backend.domain.AccessOutcome;
import com.covianhive.student_loan_system_backend.domain.RoleType;
import com.covianhive.student_loan_system_backend.persistence.converter.LocalDateTimeSqliteConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "access_logs")
public class AccessLogEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String actor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoleType role;

    @Column(name = "bank_id")
    private Long bankId;

    @Column(name = "student_id")
    private Long studentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessAction action;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccessOutcome outcome;

    @Column(nullable = false)
    private String reason;

    @Column(nullable = false)
    @Convert(converter = LocalDateTimeSqliteConverter.class)
    private LocalDateTime timestamp;

    public AccessLogEntryEntity() {
    }

    public AccessLogEntryEntity(Long id, String actor, RoleType role, Long bankId, Long studentId, AccessAction action, AccessOutcome outcome, String reason, LocalDateTime timestamp) {
        this.id = id;
        this.actor = actor;
        this.role = role;
        this.bankId = bankId;
        this.studentId = studentId;
        this.action = action;
        this.outcome = outcome;
        this.reason = reason;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActor() {
        return actor;
    }

    public void setActor(String actor) {
        this.actor = actor;
    }

    public RoleType getRole() {
        return role;
    }

    public void setRole(RoleType role) {
        this.role = role;
    }

    public Long getBankId() {
        return bankId;
    }

    public void setBankId(Long bankId) {
        this.bankId = bankId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public AccessAction getAction() {
        return action;
    }

    public void setAction(AccessAction action) {
        this.action = action;
    }

    public AccessOutcome getOutcome() {
        return outcome;
    }

    public void setOutcome(AccessOutcome outcome) {
        this.outcome = outcome;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
