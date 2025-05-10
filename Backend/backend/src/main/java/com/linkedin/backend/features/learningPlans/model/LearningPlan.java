package com.linkedin.backend.features.learningPlans.model;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.context.annotation.Primary;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
@Entity

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="learning_plans")

public class LearningPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "title")
    private String title;   // Name of the learning plan

    @Column(name = "description")
    private String description; // Description of the plan
//#to store primitive types
    @ElementCollection
    @CollectionTable(name="learning_plan_topics",joinColumns=@JoinColumn(name="learning_plan_id"))
    @Column(name = "topic")
    private List<String> topics;  // List of topics in the plan

@OneToMany(cascade=CascadeType.ALL,fetch=FetchType.LAZY)
@JoinColumn(name="learning_plan_id")
    private List<Milestone> milestones;  // List of milestones with deadlines (Milestone class)
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Column(name = "timeline_start")
    private String timelineStart; // Start date of the learning plan (e.g., "2025-05-01")
    @JsonSerialize(using = LocalDateTimeSerializer.class)
    @Column(name = "timeline_end")
    private String timelineEnd;   // End date of the learning plan (e.g., "2025-12-01")
    @ElementCollection
    @CollectionTable(name = "learning_plan_resources", joinColumns = @JoinColumn(name = "learning_plan_id"))

    @Column(name = "resource")

    private List<String> resources;
    public LearningPlan(Long id, String title, String description, List<String> topics,
                        List<Milestone> milestones, LocalDate timelineStart, LocalDate timelineEnd,
                        List<String> resources) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.topics = topics;
        this.milestones = milestones;
        this.resources = resources;
    }
}