package com.Surveillance.service;

import com.Surveillance.model.Alerte;
import com.Surveillance.repository.AlerteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AlerteService {
    
    @Autowired
    private AlerteRepository alerteRepository;
    
    @Autowired
    private RabbitMQService rabbitMQService;
    
    public List<Alerte> getAllAlertes() {
        return alerteRepository.findAll();
    }
    
    public Optional<Alerte> getAlerteById(String id) {
        return alerteRepository.findById(id);
    }
    
    public Alerte createAlerte(Alerte alerte) {
        // Ensure date is set
        if (alerte.getDateDetection() == null) {
            alerte.setDateDetection(java.time.LocalDateTime.now());
        }
        
        // Save the alerte first
        Alerte savedAlerte = alerteRepository.save(alerte);
        
        // Publish alerte asynchronously to Maintenance (don't block on error)
        try {
            rabbitMQService.publishAlerte(savedAlerte);
        } catch (Exception e) {
            // Log error but don't fail creation
            System.err.println("Error publishing to RabbitMQ (alerte still created): " + e.getMessage());
        }
        
        // Return created alerte even if publication failed
        return savedAlerte;
    }
    
    public Alerte updateAlerte(String id, Alerte alerte) {
        Optional<Alerte> existingAlerte = alerteRepository.findById(id);
        if (existingAlerte.isPresent()) {
            Alerte alerteToUpdate = existingAlerte.get();
            // Preserve existing detection date
            alerteToUpdate.setType(alerte.getType());
            alerteToUpdate.setMessage(alerte.getMessage());
            alerteToUpdate.setNiveauGravite(alerte.getNiveauGravite());
            // dateDetection remains unchanged
            return alerteRepository.save(alerteToUpdate);
        }
        return null;
    }
    
    public void deleteAlerte(String id) {
        alerteRepository.deleteById(id);
    }
    
    public List<Alerte> getAlertesByNiveauGravite(String niveauGravite) {
        return alerteRepository.findByNiveauGravite(niveauGravite);
    }
}
