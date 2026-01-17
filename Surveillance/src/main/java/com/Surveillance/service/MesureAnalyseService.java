package com.Surveillance.service;

import com.Surveillance.model.MesureAnalyse;
import com.Surveillance.repository.MesureAnalyseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MesureAnalyseService {
    
    @Autowired
    private MesureAnalyseRepository mesureAnalyseRepository;
    
    @Autowired
    private DetectionAnomalieService detectionAnomalieService;
    
    public List<MesureAnalyse> getAllMesures() {
        return mesureAnalyseRepository.findAll();
    }
    
    public Optional<MesureAnalyse> getMesureById(String id) {
        return mesureAnalyseRepository.findById(id);
    }
    
    public MesureAnalyse createMesure(MesureAnalyse mesure) {
        if (mesure.getDate() == null) {
            mesure.setDate(java.time.LocalDateTime.now());
        }
        
        MesureAnalyse savedMesure = mesureAnalyseRepository.save(mesure);
        
        try {
            detectionAnomalieService.detecterAnomalie(savedMesure);
        } catch (Exception e) {
            System.err.println("Error during anomaly detection (mesure still created): " + e.getMessage());
        }
        
        return savedMesure;
    }
    
    public MesureAnalyse updateMesure(String id, MesureAnalyse mesure) {
        Optional<MesureAnalyse> existingMesure = mesureAnalyseRepository.findById(id);
        if (existingMesure.isPresent()) {
            MesureAnalyse mesureToUpdate = existingMesure.get();
            mesureToUpdate.setSourceId(mesure.getSourceId());
            mesureToUpdate.setValeur(mesure.getValeur());
            mesureToUpdate.setIndicateur(mesure.getIndicateur());
            return mesureAnalyseRepository.save(mesureToUpdate);
        }
        return null;
    }
    
    public void deleteMesure(String id) {
        mesureAnalyseRepository.deleteById(id);
    }
    
    public List<MesureAnalyse> getMesuresBySourceId(String sourceId) {
        return mesureAnalyseRepository.findBySourceId(sourceId);
    }
}
