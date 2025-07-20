package com.linkedin.backend.features.learningPlans.service.impl;

import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.entity.LearningPlan;
import com.linkedin.backend.features.learningPlans.mapper.LearningPlanMapper;
import com.linkedin.backend.features.learningPlans.repository.LearningPlanRepository;
import com.linkedin.backend.features.learningPlans.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LearningPlanServiceImpl implements LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;
@Autowired
    public LearningPlanServiceImpl(LearningPlanRepository learningPlanRepository) {
        this.learningPlanRepository = learningPlanRepository;

    }

    @Override
    public LearningPlanDto createLearningPlan(LearningPlanDto learningPlanDto) {
        // Ensure timelineStart is set, if null, set to today's date
        if (learningPlanDto.getTimelineStart() == null) {
            learningPlanDto.setTimelineStart(LocalDate.now().toString());
        }

        LearningPlan learningPlan = LearningPlanMapper.mapToLearningPlan(learningPlanDto);
        LearningPlan savedLearningPlan = learningPlanRepository.save(learningPlan);

        return LearningPlanMapper.mapToLearningPlanDto(savedLearningPlan);
    }

    @Override
    public LearningPlanDto getLearningPlanById(Long id) {
        LearningPlan learningPlans =learningPlanRepository.findById(id).orElseThrow(()->new RuntimeException("account doesn't exist"));
        return LearningPlanMapper.mapToLearningPlanDto(learningPlans);
    }

    @Override
    public List<LearningPlanDto> getAllLearningPlans() {
      //map the entitiy to dto
    List<LearningPlan>learningPlans=learningPlanRepository.findAll();
      return learningPlans.stream().map((LearningPlan learningPlan)->LearningPlanMapper.mapToLearningPlanDto(learningPlan)).collect(Collectors.toList());

    }

    @Override
    public void deleteAllLearningPlans() {
        learningPlanRepository.deleteAll();

    }

    @Override
    public void deleteLearningPlanById(Long id) {
        LearningPlan learningPlan=learningPlanRepository.findById(id).orElseThrow(()->new RuntimeException("learning plan doesn't exist"));
        learningPlanRepository.deleteById(id);
    }

//update
    @Override
    public boolean updateLearningPlan(Long id, LearningPlan learningPlan) {
        Optional<LearningPlan> existingLearningPlan = learningPlanRepository.findById(id);
        if (existingLearningPlan.isPresent()) {
            LearningPlan plan = existingLearningPlan.get();
            // Update fields with new values
            plan.setTitle(learningPlan.getTitle());
            plan.setDescription(learningPlan.getDescription());
            plan.setTopics(learningPlan.getTopics());
            plan.setMilestones(learningPlan.getMilestones());
            plan.setResources(learningPlan.getResources());

            learningPlanRepository.save(plan);
            return true;
        } else {
            return false;
        }
    }
}



