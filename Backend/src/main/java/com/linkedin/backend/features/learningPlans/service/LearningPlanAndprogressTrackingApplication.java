package com.linkedin.backend.features.learningPlans.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LearningPlanAndprogressTrackingApplication {

	public static void main(String[] args) {
		SpringApplication.run(LearningPlanAndprogressTrackingApplication.class, args);
	}

}
