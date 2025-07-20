package com.linkedin.backend.features.learningPlans.repository;

import com.linkedin.backend.features.learningPlans.entity.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan,Long> {
}

