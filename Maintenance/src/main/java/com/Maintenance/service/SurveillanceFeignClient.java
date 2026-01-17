package com.Maintenance.service;

import com.Maintenance.dto.AlerteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class SurveillanceFeignClient {
    
    private static final String SURVEILLANCE_SERVICE_URL = "http://localhost:8080";
    
    @Autowired
    private RestTemplate restTemplate;
    
    public AlerteDTO getAlerteById(String id) {
        try {
            ResponseEntity<AlerteDTO> response = restTemplate.getForEntity(
                SURVEILLANCE_SERVICE_URL + "/api/alertes/" + id, 
                AlerteDTO.class
            );
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            }
            throw new RuntimeException("Alerte non trouvee: " + id);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la recuperation de l'alerte: " + id, e);
        }
    }
}
