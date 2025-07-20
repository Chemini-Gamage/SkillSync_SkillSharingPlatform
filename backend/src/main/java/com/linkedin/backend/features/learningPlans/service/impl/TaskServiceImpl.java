package com.linkedin.backend.features.learningPlans.service.impl;

import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.dto.MilestoneDto;
import com.linkedin.backend.features.learningPlans.dto.TaskStatDto;

import com.linkedin.backend.features.learningPlans.entity.LearningPlan;
import com.linkedin.backend.features.learningPlans.entity.Milestone;
import com.linkedin.backend.features.learningPlans.repository.LearningPlanRepository;


import com.linkedin.backend.features.learningPlans.service.TaskStatService;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskStatService {

    private final LearningPlanRepository learningPlanRepository;

    public TaskServiceImpl(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    @Override
    public List<TaskStatDto> getWeeklyStats(List<LearningPlan> allPlans) {

        Map<DayOfWeek, Integer> taskMap = new TreeMap<>();

        for (LearningPlan plan : allPlans) {
            if (plan.getMilestones() == null) continue;

            for (
            Milestone milestone : plan.getMilestones()) {
                LocalDate deadline = milestone.getDeadline();
                if (deadline != null) {
                    DayOfWeek day = deadline.getDayOfWeek();
                    taskMap.put(day, taskMap.getOrDefault(day, 0) + 1);
                }
            }
        }

        return taskMap.entrySet()
                .stream()
                .map(entry -> new TaskStatDto(entry.getKey().name().substring(0, 3), entry.getValue()))
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskStatDto> getMonthlyStats(List<LearningPlan> allMonthlyPlans) {
        List<LearningPlan> allPlans = learningPlanRepository.findAll();

        Map<Month, Integer> taskMap = new TreeMap<>();

        for (LearningPlan plan : allPlans) {
            if (plan.getMilestones() == null) continue;

            for (Milestone milestone : plan.getMilestones()) {
                LocalDate deadline = milestone.getDeadline();
                if (deadline != null) {
                    Month month = deadline.getMonth();
                    taskMap.put(month, taskMap.getOrDefault(month, 0) + 1);
                }
            }
        }

        return taskMap.entrySet()
                .stream()
                .map(entry -> new TaskStatDto(entry.getKey().name().substring(0, 3), entry.getValue()))
                .collect(Collectors.toList());
    }
}
