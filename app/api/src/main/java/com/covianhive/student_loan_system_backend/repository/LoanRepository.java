package com.covianhive.student_loan_system_backend.repository;

import com.covianhive.student_loan_system_backend.persistence.entity.LoanEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoanRepository extends JpaRepository<LoanEntity, Long> {
    List<LoanEntity> findByStudentIdOrderByIdAsc(Long studentId);
}
