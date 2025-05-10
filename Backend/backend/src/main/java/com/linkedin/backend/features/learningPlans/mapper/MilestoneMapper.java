package com.linkedin.backend.features.learningPlans.mapper;

import com.linkedin.backend.features.learningPlans.dto.MilestoneDto;
import com.linkedin.backend.features.learningPlans.model.Milestone;

import java.util.List;
import java.util.stream.Collectors;

public class MilestoneMapper {

    public static List<Milestone> mapToMilestoneList(List<MilestoneDto> milestoneDtos) {
        return milestoneDtos.stream()
                .map(dto -> new Milestone(
                        dto.getId(),
                        dto.getTitle(),
                        dto.getDescription(),
                        dto.getDeadline(),
                        dto.getStatus(),
                        null, // learningPlan will be set separately
                        null  // tasks are not mapped here
                ))
                .collect(Collectors.toList());
    }

    public static List<MilestoneDto> mapToMilestoneDtoList(List<Milestone> milestones) {
        return milestones.stream()
                .map(milestone -> new MilestoneDto(
                        milestone.getId(),
                        milestone.getTitle(),
                        milestone.getDescription(),
                        milestone.getDeadline(),
                        milestone.getStatus()
                ))
                .collect(Collectors.toList());
    }
}
