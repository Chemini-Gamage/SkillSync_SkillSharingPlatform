package com.linkedin.backend.features.learningPlans.service;

import com.linkedin.backend.features.learningPlans.dto.CourseDto ;

import java.util.List;

public interface CourseTrackingService {
    CourseDto createCourseTrackingService(CourseDto courseDto);
    CourseDto getCourseById(Long id);
;
    List<CourseDto> getAllCourseTracking();

    void deleteAllCourseTracking();
}
