package com.linkedin.backend.features.learningPlans.service.impl;

import com.linkedin.backend.features.learningPlans.model.Milestone;
import com.linkedin.backend.features.learningPlans.repository.MilestoneRepository;
import com.linkedin.backend.features.learningPlans.service.MilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MilestoneServiceImpl implements MilestoneService {

  private final MilestoneRepository milestoneRepository;


    @Autowired
    public MilestoneServiceImpl(MilestoneRepository milestoneRepository){
        this.milestoneRepository=milestoneRepository;

    }

    @Override
    public Optional<Milestone> markAsCompleted(Long id) {
       Optional<Milestone>optionalMilestone=milestoneRepository.findById(id);
       if(optionalMilestone.isPresent()){
           Milestone milestone=optionalMilestone.get();
                   milestone.setStatus("Completed");
           milestoneRepository.save(milestone);
    }
       return optionalMilestone;




      }
}
