package com.linkedin.backend.features.learningPlans.service.impl;

import com.linkedin.backend.features.learningPlans.dto.CourseDto;
import com.linkedin.backend.features.learningPlans.entity.CourseTracking;
import com.linkedin.backend.features.learningPlans.mapper.CourseMapper;
import com.linkedin.backend.features.learningPlans.repository.CourseTrackingRepository;
import com.linkedin.backend.features.learningPlans.service.CourseTrackingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseTrackingServiceImpl implements CourseTrackingService {

    private final CourseTrackingRepository courseTrackingRepository;

    @Autowired
    public CourseTrackingServiceImpl(CourseTrackingRepository courseTrackingRepository) {
        this.courseTrackingRepository = courseTrackingRepository;
    }

    @Override

    public CourseDto createCourseTrackingService(CourseDto courseDto) {
        CourseTracking courseTracking = CourseMapper.mapToCourse(courseDto);
        CourseTracking savedCourseTracking = courseTrackingRepository.save(courseTracking);
        return CourseMapper.mapToCourseDto(savedCourseTracking);
    }

    @Override
    public CourseDto getCourseById(Long id) {
        CourseTracking tracking = courseTrackingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tracking not found with id: " + id));
        return CourseMapper.mapToCourseDto(tracking);
    }

    @Override
    public List<CourseDto> getAllCourseTracking() {
        List<CourseTracking>courseTrackings=courseTrackingRepository.findAll();
        return courseTrackings.stream().map((CourseTracking courseTracking)->CourseMapper.mapToCourseDto(courseTracking)).collect(Collectors.toList());

    }
    public void deleteAllCourseTracking(){
        courseTrackingRepository.deleteAll();
    }



}
