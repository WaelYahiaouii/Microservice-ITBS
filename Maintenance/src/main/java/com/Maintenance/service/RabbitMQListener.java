package com.Maintenance.service;

import com.Maintenance.dto.AlerteDTO;
import com.Maintenance.model.Intervention;
import com.Maintenance.model.Technicien;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RabbitMQListener {
    
    @Autowired
    private InterventionService interventionService;
    
    @Autowired
    private TechnicienService technicienService;
    
    @RabbitListener(queues = "anomalie.queue")
    public void receiveAlerte(AlerteDTO alerteDTO) {
        System.out.println("New alerte received asynchronously: " + alerteDTO.getId());
        
        // Automatically create intervention ticket
        createAutomaticIntervention(alerteDTO);
    }
    
    private void createAutomaticIntervention(AlerteDTO alerteDTO) {
        // Find available technicien
        List<Technicien> availableTechniciens = technicienService.getTechniciensDisponibles();
        
        if (!availableTechniciens.isEmpty()) {
            Technicien technicien = availableTechniciens.get(0);
            
            Intervention intervention = new Intervention();
            intervention.setAlerteId(alerteDTO.getId());
            intervention.setTechnicienId(technicien.getId());
            intervention.setDatePlanifiee(LocalDateTime.now().plusHours(1));
            intervention.setStatut("SCHEDULED");
            
            try {
                interventionService.createIntervention(intervention);
                System.out.println("Intervention automatically created for alerte: " + alerteDTO.getId());
            } catch (Exception e) {
                System.err.println("Error creating automatic intervention: " + e.getMessage());
            }
        } else {
            System.out.println("No available technicien for alerte: " + alerteDTO.getId());
        }
    }
}
