package com.linkedin.backend.features.learningPlans.model;

import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import com.linkedin.backend.features.learningPlans.model.TaskStat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "milestones")
@Entity
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private LocalDate deadline;

    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "learning_plan_id")
    private LearningPlan learningPlan;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "milestone")
    private List<TaskStat> tasks;

    // Constructor with Long id, String title, LocalDate deadline, String status
    public Milestone(Long id, String title, LocalDate deadline, String status) {
        this.id = id;
        this.title = title;
        this.deadline = deadline;
        this.status = status;
        this.description = "";  // Default description if not provided
    }
    public void setName(String title) {
        this.title = title;
    }
    // Add the getName method for title
    public String getName() {
        return this.title;
    }
}
