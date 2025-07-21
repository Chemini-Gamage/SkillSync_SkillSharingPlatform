package com.linkedin.backend.features.learningPlans.mapper;

import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.entity.LearningPlan;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Optional;

public class LearningPlanMapper {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    // Mapping from LearningPlanDto to LearningPlan entity
    public static LearningPlan mapToLearningPlan(LearningPlanDto learningPlanDto) {

    return new LearningPlan(
                learningPlanDto.getId(),
                learningPlanDto.getTitle(),
                learningPlanDto.getDescription(),
                learningPlanDto.getTopics(),
                learningPlanDto.getMilestones() != null
                        ? MilestoneMapper.mapToMilestoneList(learningPlanDto.getMilestones()) // Use MilestoneMapper to convert to entities
                        : Collections.emptyList(),
               (learningPlanDto.getTimelineStart()), // Parse the start date
               (learningPlanDto.getTimelineEnd()),   // Parse the end date
                learningPlanDto.getResources()
        );

    }

    // Safely parse a String to LocalDate using the provided formatter
    private static LocalDate parseDateSafely(String date) {
        System.out.println("Parsing date: " + date);
        return Optional.ofNullable(date)
                .map(d -> LocalDate.parse(d, FORMATTER)) // Parse String to LocalDate
                .orElse(null);
    }

    // Mapping from LearningPlan entity to LearningPlanDto
    public static LearningPlanDto mapToLearningPlanDto(LearningPlan learningPlan) {

        System.out.println("timeline end entitiy:"+learningPlan.getTimelineEnd());
        return new LearningPlanDto(
                learningPlan.getId(),
                learningPlan.getTitle(),
                learningPlan.getDescription(),
                learningPlan.getTopics(),
                learningPlan.getMilestones() != null
                        ? MilestoneMapper.mapToMilestoneDtoList(learningPlan.getMilestones())
                        : Collections.emptyList(),
                (learningPlan.getTimelineStart() != null) ? learningPlan.getTimelineStart() : null,
                (learningPlan.getTimelineEnd() != null) ? learningPlan.getTimelineEnd() : null,
                learningPlan.getResources()
        );
    }
}
