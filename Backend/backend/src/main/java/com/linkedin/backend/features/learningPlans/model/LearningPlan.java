package com.linkedin.backend.features.learningPlans.model;

import com.linkedin.backend.features.authentication.model.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "learning_plans")
public class LearningPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Title of the learning plan
    private String description; // Description of the learning plan


    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_plan_id")
    private List<Milestone> milestones; // List of milestones for the learning plan

    private LocalDate timelineStart; // Start date
    private LocalDate timelineEnd; // End date

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // The user to which this plan belongs

    @ElementCollection
    @CollectionTable(name = "learning_plan_resources", joinColumns = @JoinColumn(name = "learning_plan_id"))
    @Column(name = "resource")
    private List<String> resources; // Resources for the learning plan

    public LearningPlan(Long id, String title, String description, List<String> topics, List<Milestone> milestones,
                        LocalDate timelineStart, LocalDate timelineEnd, List<String> resources, User user) {
        this.id = id;
        this.title = title;
        this.description = description;

        this.milestones = milestones;
        this.timelineStart = timelineStart;
        this.timelineEnd = timelineEnd;
        this.resources = resources;
        this.user = user;
    }
}
