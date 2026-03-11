package com.covianhive.student_loan_system_backend.repository;

import com.covianhive.student_loan_system_backend.persistence.entity.AllowanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AllowanceRepository extends JpaRepository<AllowanceEntity, Long> {
    List<AllowanceEntity> findByStudentIdOrderByIdAsc(Long studentId);
    boolean existsByStudentIdAndDisbursedAtBetween(Long studentId, LocalDateTime from, LocalDateTime to);
}
