package com.linkedin.backend.features.learningPlans.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class TaskStatDto {
    private String label;
    private int tasks;

}
