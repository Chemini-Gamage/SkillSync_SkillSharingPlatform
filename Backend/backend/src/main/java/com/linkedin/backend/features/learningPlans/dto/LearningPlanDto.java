package com.linkedin.backend.features.learningPlans.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@AllArgsConstructor
@Data
public class LearningPlanDto {
    private Long id;
    private String title;
    private String description;

    private List<MilestoneDto> milestones;
    private String timelineStart;
    private String timelineEnd;
    private List<String> resources;
    private Long userId;

}
