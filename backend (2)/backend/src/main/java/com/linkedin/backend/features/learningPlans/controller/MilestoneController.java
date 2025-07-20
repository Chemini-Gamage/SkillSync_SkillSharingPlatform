package com.linkedin.backend.features.learningPlans.controller;

import com.linkedin.backend.features.learningPlans.entity.Milestone;
import com.linkedin.backend.features.learningPlans.repository.MilestoneRepository;
import com.linkedin.backend.features.learningPlans.service.MilestoneService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;



@CrossOrigin(origins="http://localhost:3000")
@RestController

@RequestMapping("/api/milestone")
public class MilestoneController {
    private final MilestoneRepository milestoneRepository;
    private MilestoneService milestoneService;
    public MilestoneController(MilestoneService milestoneService, MilestoneRepository milestoneRepository){
        this.milestoneService=milestoneService;
        this.milestoneRepository = milestoneRepository;
    }

@Transactional
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> markMilestoneAsComplete(@PathVariable Long id) {
    Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
    if (!optionalMilestone.isPresent()) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body("milestone with the id"  + id  + "not found");
    }
    Milestone milestone = optionalMilestone.get();
    //TO UPDATE THE STATUS TO COMPLETE
    milestone.setStatus("Completed");
    milestoneRepository.save(milestone);
    return ResponseEntity.ok(milestone);

}
    @Transactional
//start now->in progress
    @PutMapping("/{id}/inprogress")
    public ResponseEntity<?> markMilestoneAsInProgress(@PathVariable Long id) {
        Optional<Milestone> optionalMilestone = milestoneRepository.findById(id);
        if (!optionalMilestone.isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("milestone with the id"  + id  + "not found");
        }
        Milestone milestone = optionalMilestone.get();
        //TO UPDATE THE STATUS TO inprogress
        milestone.setStatus("InProgress");
        milestoneRepository.save(milestone);
        return ResponseEntity.ok(milestone);

    }}

