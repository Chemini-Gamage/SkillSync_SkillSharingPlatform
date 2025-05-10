package com.linkedin.backend.features.learningPlans.repository;

import com.linkedin.backend.features.authentication.model.User;
import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {

    // Find all learning plans associated with a specific user
    List<LearningPlan> findByUserId(Long userId);

    // Find a learning plan by ID and user ID
    Optional<LearningPlan> findByIdAndUserId(Long learningPlanId, Long userId);
    List<LearningPlan> findAllByUser(User user);

    // Alternative bulk delete query
    @Modifying
    @Query("DELETE FROM LearningPlan lp WHERE lp.user = :user")
    void deleteAllByUser(@Param("user") User user);
}
