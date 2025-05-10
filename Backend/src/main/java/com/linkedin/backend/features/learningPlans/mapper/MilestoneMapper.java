package com.linkedin.backend.features.learningPlans.mapper;

import com.linkedin.backend.features.learningPlans.dto.MilestoneDto;
import com.linkedin.backend.features.learningPlans.model.Milestone;

import java.util.List;
import java.util.stream.Collectors;

public class MilestoneMapper {

    // Convert MilestoneDto to Milestone entity
    public static Milestone mapToMilestone(MilestoneDto milestoneDto) {
        Milestone milestone =new Milestone(
                milestoneDto.getId(),
                milestoneDto.getName(),
                milestoneDto.getDeadline(),
                milestoneDto.getStatus()
        );
        return milestone;

    }

    // Convert Milestone entity to MilestoneDto
    public static MilestoneDto mapToMilestoneDto(Milestone milestone) {
     MilestoneDto milestoneDto= new MilestoneDto(


                milestone.getId(),
                milestone.getName(),
                milestone.getDeadline(),
                milestone.getStatus()
        );
        return  milestoneDto;

    }

    // Convert List of Milestone entities to List of MilestoneDto objects
    public static List<MilestoneDto> mapToMilestoneDtoList(List<Milestone> milestones) {
        return milestones.stream()
                .map(MilestoneMapper::mapToMilestoneDto)
                .collect(Collectors.toList());
    }

    // Convert List of MilestoneDto objects to List of Milestone entities
    public static List<Milestone> mapToMilestoneList(List<MilestoneDto> milestoneDtos) {
        return milestoneDtos.stream()
                .map(MilestoneMapper::mapToMilestone)  // Convert MilestoneDto to Milestone
                .collect(Collectors.toList());
    }
}
