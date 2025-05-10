package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.learningPlans.dto.TaskStatDto;
import com.linkedin.backend.features.learningPlans.model.LearningPlan;

import java.util.List;

public interface TaskStatService {
    // Update these to match the actual service implementation methods
    List<TaskStatDto> getWeeklyStats(List<LearningPlan> allPlans); // Updated name
    List<TaskStatDto> getMonthlyStats(List<LearningPlan> allPlans); // Updated name
}
