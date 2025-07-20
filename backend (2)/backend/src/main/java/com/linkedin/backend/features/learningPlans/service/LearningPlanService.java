package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.entity.LearningPlan;

import java.util.List;

public interface LearningPlanService {


    LearningPlanDto createLearningPlan(LearningPlanDto learningPlanDto);

    LearningPlanDto getLearningPlanById(Long id);

    List<LearningPlanDto> getAllLearningPlans();
//delete all

    void deleteAllLearningPlans();

    //delete by id
    void deleteLearningPlanById(Long id);
//update
    public boolean updateLearningPlan(Long id, LearningPlan learningPlan);




}