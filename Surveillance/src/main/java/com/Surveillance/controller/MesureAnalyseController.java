package com.Surveillance.controller;

import com.Surveillance.model.MesureAnalyse;
import com.Surveillance.service.MesureAnalyseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mesures")
@CrossOrigin(origins = "*")
public class MesureAnalyseController {
    
    @Autowired
    private MesureAnalyseService mesureAnalyseService;
    
    @GetMapping
    public ResponseEntity<List<MesureAnalyse>> getAllMesures() {
        return ResponseEntity.ok(mesureAnalyseService.getAllMesures());
    }
    
    @GetMapping("/source/{sourceId}")
    public ResponseEntity<List<MesureAnalyse>> getMesuresBySourceId(@PathVariable String sourceId) {
        return ResponseEntity.ok(mesureAnalyseService.getMesuresBySourceId(sourceId));
    }
    
    @PostMapping
    public ResponseEntity<MesureAnalyse> createMesure(@RequestBody MesureAnalyse mesure) {
        MesureAnalyse created = mesureAnalyseService.createMesure(mesure);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMesure(@PathVariable String id) {
        mesureAnalyseService.deleteMesure(id);
        return ResponseEntity.noContent().build();
    }
}
