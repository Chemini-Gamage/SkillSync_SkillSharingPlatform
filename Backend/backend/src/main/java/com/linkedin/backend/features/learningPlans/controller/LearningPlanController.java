package com.linkedin.backend.features.learningPlans.controller;

import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto;
import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import com.linkedin.backend.features.learningPlans.service.LearningPlanService;
import com.linkedin.backend.features.authentication.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/learning-plans")
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

    // Create a new learning plan for the authenticated user
    @PostMapping
    public ResponseEntity<LearningPlan> createLearningPlan(@RequestBody LearningPlanDto learningPlanDto,
                                                           @RequestAttribute("authenticatedUser") User user) {
        LearningPlan createdLearningPlan = learningPlanService.createLearningPlan(learningPlanDto, user);
        return ResponseEntity.ok(createdLearningPlan);
    }

    // Get all learning plans for the authenticated user
    @GetMapping
    public ResponseEntity<List<LearningPlan>> getLearningPlans(@RequestAttribute("authenticatedUser") User user) {
        List<LearningPlan> learningPlans = learningPlanService.getLearningPlans(user);
        return ResponseEntity.ok(learningPlans);
    }

    // Get a learning plan by ID for the authenticated user
    @GetMapping("/{learningPlanId}")
    public ResponseEntity<LearningPlan> getLearningPlanById(@PathVariable Long learningPlanId,
                                                            @RequestAttribute("authenticatedUser") User user) {
        LearningPlan learningPlan = learningPlanService.getLearningPlanById(learningPlanId, user);
        return ResponseEntity.ok(learningPlan);
    }

    // Update a learning plan for the authenticated user
    @PutMapping("/{learningPlanId}")
    public ResponseEntity<LearningPlan> updateLearningPlan(@PathVariable Long learningPlanId,
                                                           @RequestBody LearningPlanDto learningPlanDto,
                                                           @RequestAttribute("authenticatedUser") User user) {
        LearningPlan updatedLearningPlan = learningPlanService.updateLearningPlan(learningPlanId, learningPlanDto, user);
        return ResponseEntity.ok(updatedLearningPlan);
    }

    // Delete a learning plan by ID for the authenticated user
    @DeleteMapping("/{learningPlanId}")
    public ResponseEntity<Void> deleteLearningPlan(@PathVariable Long learningPlanId,
                                                   @RequestAttribute("authenticatedUser") User user) {
        learningPlanService.deleteLearningPlan(learningPlanId, user);
        return ResponseEntity.noContent().build();
    }
    // Controller
    @DeleteMapping
    public ResponseEntity<Void> deleteAllLearningPlans(
            @RequestAttribute("authenticatedUser") User user) {
        learningPlanService.deleteAllLearningPlans(user);
        return ResponseEntity.noContent().build();
    }

}
