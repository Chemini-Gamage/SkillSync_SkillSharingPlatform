package com.linkedin.backend.features.learningPlans.mapper;
import com.linkedin.backend.features.learningPlans.dto.CourseDto;
import com.linkedin.backend.features.learningPlans.model.CourseTracking;
public class CourseMapper {
    public static CourseTracking mapToCourse(CourseDto courseDto){
        return new CourseTracking(
                courseDto.getId(),
                courseDto.getUserId(),
                courseDto.getCourseId(),
                courseDto.getStatus(),
                courseDto.getTimestamp()

        );
    }
    public static CourseDto mapToCourseDto(CourseTracking courseTracking){
        return new CourseDto(
                courseTracking.getId(),
                courseTracking.getUserId(),
                courseTracking.getCourseId(),
                courseTracking.getStatus(),
                courseTracking.getTimestamp()
        );
    }
}
