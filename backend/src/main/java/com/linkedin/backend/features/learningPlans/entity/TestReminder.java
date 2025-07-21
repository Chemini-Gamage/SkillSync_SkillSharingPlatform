package com.linkedin.backend.features.learningPlans.entity;

import com.linkedin.backend.features.learningPlans.service.EmailServiceLP;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDate;

public class TestReminder {
    @Autowired
    private EmailServiceLP emailService;
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
