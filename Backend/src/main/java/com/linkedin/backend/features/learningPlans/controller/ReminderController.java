package com.linkedin.backend.features.learningPlans.controller;
import com.linkedin.backend.features.learningPlans.service.ReminderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReminderController {

    @Autowired
    private ReminderService reminderService;

    @PostMapping("/send-reminder-now")
    public String sendReminderNow() {
        reminderService.sendNow();
        return "Reminder sent successfully!";
    }
}
