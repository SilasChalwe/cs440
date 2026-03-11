package com.covianhive.student_loan_system_backend.repository;

import com.covianhive.student_loan_system_backend.persistence.entity.TransactionRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRecordRepository extends JpaRepository<TransactionRecordEntity, Long> {
    List<TransactionRecordEntity> findByStudentIdOrderByIdAsc(Long studentId);
}
