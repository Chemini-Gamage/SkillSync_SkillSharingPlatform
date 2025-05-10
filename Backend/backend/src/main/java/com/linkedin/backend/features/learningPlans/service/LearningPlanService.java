package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.mapper.LearningPlanMapper;
import com.linkedin.backend.features.learningPlans.mapper.MilestoneMapper;
import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import com.linkedin.backend.features.learningPlans.repository.LearningPlanRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    public LearningPlanService(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;
    }

    // Create a new learning plan for the authenticated user
    public LearningPlan createLearningPlan(LearningPlanDto learningPlanDto, User user) {
        LearningPlan learningPlan = LearningPlanMapper.mapToLearningPlan(learningPlanDto);
        learningPlan.setUser(user); // Associate with authenticated user
        return learningPlanRepository.save(learningPlan);
    }

    // Get all learning plans for the authenticated user
    public List<LearningPlan> getLearningPlans(User user) {
        return learningPlanRepository.findByUserId(user.getId());
    }

    // Get a specific learning plan by ID for the authenticated user
    public LearningPlan getLearningPlanById(Long learningPlanId, User user) {
        return learningPlanRepository.findByIdAndUserId(learningPlanId, user.getId())
                .orElseThrow(() -> new RuntimeException("Learning Plan not found or unauthorized"));
    }

    // Update a learning plan for the authenticated user
    public LearningPlan updateLearningPlan(Long learningPlanId, LearningPlanDto learningPlanDto, User user) {
        LearningPlan existingPlan = getLearningPlanById(learningPlanId, user);
        existingPlan.setTitle(learningPlanDto.getTitle());
        existingPlan.setDescription(learningPlanDto.getDescription());

        existingPlan.setMilestones(MilestoneMapper.mapToMilestoneList(learningPlanDto.getMilestones()));
        existingPlan.setTimelineStart(LearningPlanMapper.parseDateSafely(learningPlanDto.getTimelineStart()));
        existingPlan.setTimelineEnd(LearningPlanMapper.parseDateSafely(learningPlanDto.getTimelineEnd()));
        existingPlan.setResources(learningPlanDto.getResources());
        return learningPlanRepository.save(existingPlan);
    }

    // Delete a learning plan by ID for the authenticated user
    public void deleteLearningPlan(Long learningPlanId, User user) {
        LearningPlan learningPlan = getLearningPlanById(learningPlanId, user);
        learningPlanRepository.delete(learningPlan);
    }
    public void deleteAllLearningPlans(User user) {
        List<LearningPlan> plans = learningPlanRepository.findAllByUser(user);

        if (!plans.isEmpty()) {
            learningPlanRepository.deleteAll(plans);

            // Optional: Add additional cleanup logic
            // eventPublisher.publishEvent(new LearningPlansDeletedEvent(user.getId()));
        }
    }

}
