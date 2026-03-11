package com.covianhive.student_loan_system_backend.persistence.entity;

import com.covianhive.student_loan_system_backend.domain.TransactionType;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class TransactionRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(name = "bank_id", nullable = false)
    private Long bankId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "processed_by", nullable = false)
    private String processedBy;

    @Column(name = "processed_at", nullable = false)
    @Convert(converter = LocalDateTimeSqliteConverter.class)
    private LocalDateTime processedAt;

    @Column
    private String note;

    public TransactionRecordEntity() {
    }

    public TransactionRecordEntity(Long id, TransactionType type, Long studentId, Long bankId, BigDecimal amount, String processedBy, LocalDateTime processedAt, String note) {
        this.id = id;
        this.type = type;
        this.studentId = studentId;
        this.bankId = bankId;
        this.amount = amount;
        this.processedBy = processedBy;
        this.processedAt = processedAt;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getBankId() {
        return bankId;
    }

    public void setBankId(Long bankId) {
        this.bankId = bankId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getProcessedBy() {
        return processedBy;
    }

    public void setProcessedBy(String processedBy) {
        this.processedBy = processedBy;
    }

    public LocalDateTime getProcessedAt() {
        return processedAt;
    }

    public void setProcessedAt(LocalDateTime processedAt) {
        this.processedAt = processedAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
