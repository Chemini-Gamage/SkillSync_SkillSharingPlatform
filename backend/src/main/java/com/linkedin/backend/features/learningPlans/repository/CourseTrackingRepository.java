package com.linkedin.backend.features.learningPlans.repository;

import com.linkedin.backend.features.learningPlans.entity.CourseTracking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseTrackingRepository extends JpaRepository<CourseTracking,Long> {
}
