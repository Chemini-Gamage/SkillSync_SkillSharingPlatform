package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.learningPlans.entity.Milestone;

import java.util.Optional;

public interface MilestoneService {
Optional<Milestone> markAsCompleted(Long id);
}



