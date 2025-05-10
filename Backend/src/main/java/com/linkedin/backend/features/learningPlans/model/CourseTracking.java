package com.linkedin.backend.features.learningPlans.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="course_tracking")
public class CourseTracking {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    @Column(name="user_id")
    private Long userId;
    @Column(name="course_id")
    private Long courseId;
    @Column(name="status")
    private String status;
    @Column(name="timestamp")
    private LocalDateTime timestamp;
}
