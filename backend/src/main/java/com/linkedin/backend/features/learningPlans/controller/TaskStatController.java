package com.linkedin.backend.features.learningPlans.controller;

import com.linkedin.backend.features.learningPlans.dto.TaskStatDto;
import com.linkedin.backend.features.learningPlans.entity.LearningPlan;
import com.linkedin.backend.features.learningPlans.repository.LearningPlanRepository;
import com.linkedin.backend.features.learningPlans.service.TaskStatService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/stats")
public class TaskStatController {

    private final TaskStatService taskStatService;
    private final LearningPlanRepository learningPlanRepository;

    public TaskStatController(TaskStatService taskStatService, LearningPlanRepository learningPlanRepository) {
        this.taskStatService = taskStatService;
        this.learningPlanRepository = learningPlanRepository;
    }

    @GetMapping("/weekly")
    public List<TaskStatDto> getWeeklyStats() {
        List<LearningPlan> plans = learningPlanRepository.findAll();
        return taskStatService.getWeeklyStats(plans); // Correct method name
    }

    @GetMapping("/monthly")
    public List<TaskStatDto> getMonthlyStats() {
        List<LearningPlan> plans = learningPlanRepository.findAll();
        return taskStatService.getMonthlyStats(plans); // Correct method name
    }
}

