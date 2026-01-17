package com.Maintenance.controller;

import com.Maintenance.model.Technicien;
import com.Maintenance.service.TechnicienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/techniciens")
@CrossOrigin(origins = "*")
public class TechnicienController {
    
    @Autowired
    private TechnicienService technicienService;
    
    @GetMapping
    public ResponseEntity<List<Technicien>> getAllTechniciens() {
        return ResponseEntity.ok(technicienService.getAllTechniciens());
    }
    
    @GetMapping("/disponibles")
    public ResponseEntity<List<Technicien>> getTechniciensDisponibles() {
        return ResponseEntity.ok(technicienService.getTechniciensDisponibles());
    }
    
    @GetMapping("/nom/{nom}")
    public ResponseEntity<List<Technicien>> getTechniciensByNom(@PathVariable String nom) {
        return ResponseEntity.ok(technicienService.getTechniciensByNom(nom));
    }
    
    @PostMapping
    public ResponseEntity<Technicien> createTechnicien(@RequestBody Technicien technicien) {
        Technicien created = technicienService.createTechnicien(technicien);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Technicien> updateTechnicien(@PathVariable String id, @RequestBody Technicien technicien) {
        Technicien updated = technicienService.updateTechnicien(id, technicien);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTechnicien(@PathVariable String id) {
        technicienService.deleteTechnicien(id);
        return ResponseEntity.noContent().build();
    }
}
