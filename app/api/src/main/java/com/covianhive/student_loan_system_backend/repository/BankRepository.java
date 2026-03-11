package com.covianhive.student_loan_system_backend.repository;

import com.covianhive.student_loan_system_backend.persistence.entity.BankEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BankRepository extends JpaRepository<BankEntity, Long> {
    Optional<BankEntity> findByCodeIgnoreCase(String code);
}
