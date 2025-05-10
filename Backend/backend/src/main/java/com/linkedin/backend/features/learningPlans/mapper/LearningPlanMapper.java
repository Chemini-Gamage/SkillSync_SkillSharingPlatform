package com.linkedin.backend.features.learningPlans.mapper;

import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import com.linkedin.backend.features.authentication.model.User;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Optional;

public class LearningPlanMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Mapping from LearningPlan entity to DTO
    public static LearningPlanDto mapToLearningPlanDto(LearningPlan learningPlan) {
        return new LearningPlanDto(
                learningPlan.getId(),
                learningPlan.getTitle(),
                learningPlan.getDescription(),
                learningPlan.getMilestones() != null
                        ? MilestoneMapper.mapToMilestoneDtoList(learningPlan.getMilestones())
                        : Collections.emptyList(),
                learningPlan.getTimelineStart() != null ? learningPlan.getTimelineStart().toString() : null,
                learningPlan.getTimelineEnd() != null ? learningPlan.getTimelineEnd().toString() : null,
                learningPlan.getResources(),
                learningPlan.getUser() != null ? learningPlan.getUser().getId() : null // ✅ safe access to user ID
        );
    }

    // Mapping from DTO to entity (user will be set separately)
    public static LearningPlan mapToLearningPlan(LearningPlanDto dto) {
        LearningPlan plan = new LearningPlan();
        plan.setId(dto.getId());
        plan.setTitle(dto.getTitle());
        plan.setDescription(dto.getDescription());

        plan.setMilestones(dto.getMilestones() != null
                ? MilestoneMapper.mapToMilestoneList(dto.getMilestones())
                : Collections.emptyList());
        plan.setTimelineStart(parseDateSafely(dto.getTimelineStart()));
        plan.setTimelineEnd(parseDateSafely(dto.getTimelineEnd()));
        plan.setResources(dto.getResources());
        return plan;
    }

    public static LocalDate parseDateSafely(String date) {
        return Optional.ofNullable(date)
                .map(d -> LocalDate.parse(d, FORMATTER))
                .orElse(null);
    }
}
