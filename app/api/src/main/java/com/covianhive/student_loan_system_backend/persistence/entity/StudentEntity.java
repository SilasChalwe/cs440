package com.covianhive.student_loan_system_backend.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "students")
public class StudentEntity {

    @Id
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "student_number", nullable = false, unique = true)
    private String studentNumber;

    @Column(name = "bank_id", nullable = false)
    private Long bankId;

    @Column(name = "allowance_amount", nullable = false)
    private BigDecimal allowanceAmount;

    @Column(name = "loan_limit", nullable = false)
    private BigDecimal loanLimit;

    @Column(name = "bank_account", nullable = false)
    private String bankAccount;

    public StudentEntity() {
    }

    public StudentEntity(Long id, String name, String studentNumber, Long bankId, BigDecimal allowanceAmount, BigDecimal loanLimit, String bankAccount) {
        this.id = id;
        this.name = name;
        this.studentNumber = studentNumber;
        this.bankId = bankId;
        this.allowanceAmount = allowanceAmount;
        this.loanLimit = loanLimit;
        this.bankAccount = bankAccount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStudentNumber() {
        return studentNumber;
    }

    public void setStudentNumber(String studentNumber) {
        this.studentNumber = studentNumber;
    }

    public Long getBankId() {
        return bankId;
    }

    public void setBankId(Long bankId) {
        this.bankId = bankId;
    }

    public BigDecimal getAllowanceAmount() {
        return allowanceAmount;
    }

    public void setAllowanceAmount(BigDecimal allowanceAmount) {
        this.allowanceAmount = allowanceAmount;
    }

    public BigDecimal getLoanLimit() {
        return loanLimit;
    }

    public void setLoanLimit(BigDecimal loanLimit) {
        this.loanLimit = loanLimit;
    }

    public String getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(String bankAccount) {
        this.bankAccount = bankAccount;
    }
}
