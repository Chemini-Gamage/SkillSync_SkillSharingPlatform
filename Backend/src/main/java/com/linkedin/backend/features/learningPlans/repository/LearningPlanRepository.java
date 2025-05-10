package com.linkedin.backend.features.learningPlans.repository;

import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
    // Custom query methods can be added here if necessary
}
