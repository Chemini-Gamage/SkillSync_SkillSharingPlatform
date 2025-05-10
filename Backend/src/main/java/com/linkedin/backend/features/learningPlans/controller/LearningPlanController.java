package com.linkedin.backend.features.learningPlans.controller;
import com.linkedin.backend.features.learningPlans.dto.LearningPlanDto ;
import com.linkedin.backend.features.learningPlans.model.LearningPlan;
import com.linkedin.backend.features.learningPlans.service.LearningPlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

//backend to the frontend
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.POST, RequestMethod.GET, RequestMethod.PUT, RequestMethod.DELETE})

@RestController
@RequestMapping("/api/learn-track")

public class LearningPlanController {
    private LearningPlanService learningPlanService;

  public LearningPlanController(LearningPlanService learningPlanService) {
        this.learningPlanService = learningPlanService;
    }

//add Learning Plan REST API
    @PostMapping
    public ResponseEntity<LearningPlanDto> addLearningPlan(@RequestBody LearningPlanDto learningPlanDto) {
        return new ResponseEntity<>(learningPlanService.createLearningPlan(learningPlanDto), HttpStatus.CREATED);
    }
    @RequestMapping(value = "", method = RequestMethod.OPTIONS)
    public ResponseEntity<?> handleOptions() {
        return ResponseEntity.ok().build();}

    @GetMapping
    public ResponseEntity<List<LearningPlanDto>> getLearningPlan() {
        List<LearningPlanDto> learningPlans = learningPlanService.getAllLearningPlans();
        return ResponseEntity.ok(learningPlans);
    }


    //Get learning rest api
    @GetMapping("/{id}")
    public ResponseEntity<LearningPlanDto> getLearningPlanById(@PathVariable Long id)
    {
    LearningPlanDto learningPlanDto = learningPlanService.getLearningPlanById(id);
            return ResponseEntity.ok(learningPlanDto);

}
//delete by id REST API
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLearningPlanById(@PathVariable Long id)
    {
        learningPlanService.deleteLearningPlanById(id);
         return ResponseEntity.ok("account is deleted succesfully");

    }

    //edit by id

@PutMapping("/{id}")
public ResponseEntity<String>updateLearningPlan(@PathVariable Long id, @RequestBody LearningPlan learningPlan){
      boolean isUpdated =learningPlanService.updateLearningPlan(id, learningPlan);
      if(isUpdated) {
          return new ResponseEntity<>("learning plan updated successfully", HttpStatus.OK);
      }else{
          {
              return new ResponseEntity<>("Learning plan not found", HttpStatus.NOT_FOUND);

          }
      }
}

    //delete all
@DeleteMapping
public ResponseEntity<String> deleteLearningPlanById()
{
    learningPlanService.deleteAllLearningPlans();
    return  new ResponseEntity<>(" all account deleted succesfully",HttpStatus.OK);

}};


