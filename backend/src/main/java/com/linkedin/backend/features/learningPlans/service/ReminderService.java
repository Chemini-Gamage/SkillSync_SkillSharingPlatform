package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.learningPlans.entity.Milestone;
import com.linkedin.backend.features.learningPlans.repository.MilestoneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
@Service
@Component
public class ReminderService {
    @Autowired
    private MilestoneRepository milestoneRepository;
    @Autowired
    private EmailServiceLP emailService;
    //at 8am everyday
    @Scheduled(cron = "0 10 3 * * ? ")

    public void sendDeadlineReminder(){
        LocalDate today= LocalDate.now();
        LocalDate twoDaysLater=today.plusDays(2);
        List<Milestone> upcomingMilestones=milestoneRepository.findByDeadlineBetweenAndStatusNot(
                today,twoDaysLater,"Completed"
        );
        for(Milestone milestone:upcomingMilestones){
            emailService.sendReminder(milestone);
            System.out.println("reminder sent for "+milestone.getName());
        }
    }
    public void sendNow(){
        sendDeadlineReminder();
    }

}
