package com.covianhive.student_loan_system_backend.persistence.entity;

import com.covianhive.student_loan_system_backend.persistence.converter.LocalDateTimeSqliteConverter;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "allowances")
public class AllowanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "student_id", nullable = false)
    private Long studentId;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "disbursed_at", nullable = false)
    @Convert(converter = LocalDateTimeSqliteConverter.class)
    private LocalDateTime disbursedAt;

    @Column
    private String note;

    public AllowanceEntity() {
    }

    public AllowanceEntity(Long id, Long studentId, BigDecimal amount, LocalDateTime disbursedAt, String note) {
        this.id = id;
        this.studentId = studentId;
        this.amount = amount;
        this.disbursedAt = disbursedAt;
        this.note = note;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getDisbursedAt() {
        return disbursedAt;
    }

    public void setDisbursedAt(LocalDateTime disbursedAt) {
        this.disbursedAt = disbursedAt;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
