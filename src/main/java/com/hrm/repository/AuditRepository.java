package com.hrm.repository;
import com.hrm.model.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditRepository extends JpaRepository<AuditTrail, Long> {}
