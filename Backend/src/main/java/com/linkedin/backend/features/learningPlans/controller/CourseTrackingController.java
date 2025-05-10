package com.linkedin.backend.features.learningPlans.controller;

import com.linkedin.backend.features.learningPlans.dto.CourseDto ;
import com.linkedin.backend.features.learningPlans.service.CourseTrackingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/course-track")
public class CourseTrackingController {

    private final CourseTrackingService courseTrackingService;

    // Constructor Injection
    public CourseTrackingController(CourseTrackingService courseTrackingService) {
        this.courseTrackingService = courseTrackingService;
    }

    // POST
    @PostMapping
    public ResponseEntity<CourseDto> addCourseTracking(@RequestBody CourseDto courseDto) {
CourseDto saved=courseTrackingService.createCourseTrackingService(courseDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);

    }

    // GET
    @GetMapping
    public ResponseEntity<List <CourseDto>> getCourse() {

List<CourseDto> courses=courseTrackingService.getAllCourseTracking();
        return ResponseEntity.ok(courses);
    }

    //deleteAll
    @DeleteMapping
    public ResponseEntity<String>deleteAllCourseTracking(){
        courseTrackingService.deleteAllCourseTracking();
        return new ResponseEntity<>("all courses tracked deleted",HttpStatus.OK);
    }
}
