package com.Maintenance.controller;

import com.Maintenance.model.Intervention;
import com.Maintenance.service.InterventionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "*")
public class InterventionController {
    
    @Autowired
    private InterventionService interventionService;
    
    @GetMapping
    public ResponseEntity<List<Intervention>> getAllInterventions() {
        return ResponseEntity.ok(interventionService.getAllInterventions());
    }
    
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Intervention>> getInterventionsByStatut(@PathVariable String statut) {
        return ResponseEntity.ok(interventionService.getInterventionsByStatut(statut));
    }
    
    @PostMapping
    public ResponseEntity<Intervention> createIntervention(@RequestBody Intervention intervention) {
        try {
            Intervention created = interventionService.createIntervention(intervention);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Intervention> updateIntervention(@PathVariable String id, @RequestBody Intervention intervention) {
        Intervention updated = interventionService.updateIntervention(id, intervention);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(@PathVariable String id) {
        interventionService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }
}
