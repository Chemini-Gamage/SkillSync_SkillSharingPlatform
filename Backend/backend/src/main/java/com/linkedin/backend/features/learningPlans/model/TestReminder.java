package com.linkedin.backend.features.learningPlans.model;

import com.linkedin.backend.features.learningPlans.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;

public class TestReminder {
    @Autowired
    private EmailService emailService;
    public void checkMilestoneREminder(){
        LocalDate milestoneDeadline= LocalDate.now().plusDays(1);
        Milestone milestone=new Milestone();
        milestone.setName("finish");
        milestone.setDeadline(milestoneDeadline);
       emailService.sendReminder(milestone
       );
System.out.println("Milestone REMINDER SENT");
    }
}
