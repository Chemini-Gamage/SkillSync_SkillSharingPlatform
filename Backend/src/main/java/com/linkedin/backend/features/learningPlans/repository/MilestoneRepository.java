package com.linkedin.backend.features.learningPlans.repository;

import com.linkedin.backend.features.learningPlans.model.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone,Long> {
    List<Milestone> findByDeadlineBetweenAndStatusNot(LocalDate start, LocalDate end, String status);
}
