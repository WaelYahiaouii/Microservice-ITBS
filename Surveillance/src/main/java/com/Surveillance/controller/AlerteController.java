package com.Surveillance.controller;

import com.Surveillance.model.Alerte;
import com.Surveillance.service.AlerteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/alertes")
@CrossOrigin(origins = "*")
public class AlerteController {
    
    @Autowired
    private AlerteService alerteService;
    
    @GetMapping
    public ResponseEntity<List<Alerte>> getAllAlertes() {
        return ResponseEntity.ok(alerteService.getAllAlertes());
    }
    
    @GetMapping("/niveau/{niveauGravite}")
    public ResponseEntity<List<Alerte>> getAlertesByNiveauGravite(@PathVariable String niveauGravite) {
        return ResponseEntity.ok(alerteService.getAlertesByNiveauGravite(niveauGravite));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Alerte> getAlerteById(@PathVariable String id) {
        Optional<Alerte> alerte = alerteService.getAlerteById(id);
        return alerte.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Alerte> createAlerte(@RequestBody Alerte alerte) {
        Alerte created = alerteService.createAlerte(alerte);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlerte(@PathVariable String id) {
        alerteService.deleteAlerte(id);
        return ResponseEntity.noContent().build();
    }
}
