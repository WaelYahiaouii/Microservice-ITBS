package com.Maintenance.service;

import com.Maintenance.model.Intervention;
import com.Maintenance.repository.InterventionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class InterventionService {
    
    @Autowired
    private InterventionRepository interventionRepository;
    
    @Autowired
    private TechnicienService technicienService;
    
    @Autowired
    private SurveillanceFeignClient surveillanceFeignClient;
    
    public List<Intervention> getAllInterventions() {
        return interventionRepository.findAll();
    }
    
    public Optional<Intervention> getInterventionById(String id) {
        return interventionRepository.findById(id);
    }
    
    public Intervention createIntervention(Intervention intervention) {
        // Verify alerte exists (synchronous communication)
        try {
            surveillanceFeignClient.getAlerteById(intervention.getAlerteId());
        } catch (Exception e) {
            throw new RuntimeException("Alerte not found in Surveillance service: " + intervention.getAlerteId());
        }
        
        // Verify technicien exists and is available
        technicienService.getTechnicienById(intervention.getTechnicienId())
            .orElseThrow(() -> new RuntimeException("Technicien not found: " + intervention.getTechnicienId()));
        
        if (intervention.getStatut() == null) {
            intervention.setStatut("SCHEDULED");
        }
        
        return interventionRepository.save(intervention);
    }
    
    public Intervention updateIntervention(String id, Intervention intervention) {
        Optional<Intervention> existingIntervention = interventionRepository.findById(id);
        if (existingIntervention.isPresent()) {
            Intervention interToUpdate = existingIntervention.get();
            interToUpdate.setAlerteId(intervention.getAlerteId());
            interToUpdate.setTechnicienId(intervention.getTechnicienId());
            interToUpdate.setDatePlanifiee(intervention.getDatePlanifiee());
            interToUpdate.setStatut(intervention.getStatut());
            return interventionRepository.save(interToUpdate);
        }
        return null;
    }
    
    public void deleteIntervention(String id) {
        interventionRepository.deleteById(id);
    }
    
    public List<Intervention> getInterventionsByAlerteId(String alerteId) {
        return interventionRepository.findByAlerteId(alerteId);
    }
    
    public List<Intervention> getInterventionsByStatut(String statut) {
        return interventionRepository.findByStatut(statut);
    }
}
