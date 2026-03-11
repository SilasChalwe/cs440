package com.covianhive.student_loan_system_backend.repository;

import com.covianhive.student_loan_system_backend.persistence.entity.StudentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
    List<StudentEntity> findByBankIdOrderByIdAsc(Long bankId);
    Optional<StudentEntity> findByStudentNumberIgnoreCase(String studentNumber);
}
