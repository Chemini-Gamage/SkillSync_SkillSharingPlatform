package com.linkedin.backend.features.learningPlans.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;  // Use LocalDate instead of Date
@Data
@AllArgsConstructor
public class MilestoneDto {

    private Long id;
    private String name;
    @JsonFormat(pattern="yyyy-MM-dd")
    private LocalDate deadline;  // Use LocalDate instead of Date
    private String status;

    }


