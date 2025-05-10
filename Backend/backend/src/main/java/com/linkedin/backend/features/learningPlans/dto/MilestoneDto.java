package com.linkedin.backend.features.learningPlans.dto;

import java.time.LocalDate;

public class MilestoneDto {
    private Long id;
    private String title;
    private String description;
    private LocalDate deadline;
    private String status;

    // Constructors
    public MilestoneDto() {}

    public MilestoneDto(Long id, String title, String description, LocalDate deadline, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.status = status;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
