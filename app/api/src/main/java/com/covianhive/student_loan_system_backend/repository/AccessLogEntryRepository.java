package com.covianhive.student_loan_system_backend.repository;

import com.covianhive.student_loan_system_backend.persistence.entity.AccessLogEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccessLogEntryRepository extends JpaRepository<AccessLogEntryEntity, Long> {
}
