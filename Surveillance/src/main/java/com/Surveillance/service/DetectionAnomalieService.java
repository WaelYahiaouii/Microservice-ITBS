package com.Surveillance.service;

import com.Surveillance.model.Alerte;
import com.Surveillance.model.MesureAnalyse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DetectionAnomalieService {
    
    @Autowired
    private AlerteService alerteService;
    
    // Thresholds for anomaly detection
    private static final double THRESHOLD_CRITICAL = 100.0;
    private static final double THRESHOLD_HIGH = 80.0;
    private static final double THRESHOLD_MEDIUM = 60.0;
    
    public void detecterAnomalie(MesureAnalyse mesure) {
        // Anomaly detection logic based on value
        if (mesure.getValeur() != null) {
            String niveauGravite = determinerNiveauGravite(mesure.getValeur());
            
            if (!niveauGravite.equals("NORMAL")) {
                Alerte alerte = new Alerte();
                alerte.setType(mesure.getSourceId() + "-" + mesure.getIndicateur());
                alerte.setMessage(String.format("Anomaly detected for indicator %s: value = %.2f", 
                    mesure.getIndicateur(), mesure.getValeur()));
                alerte.setNiveauGravite(niveauGravite);
                
                // Automatically create alerte (which will be published via RabbitMQ)
                alerteService.createAlerte(alerte);
            }
        }
    }
    
    private String determinerNiveauGravite(Double valeur) {
        if (valeur >= THRESHOLD_CRITICAL) {
            return "CRITICAL";
        } else if (valeur >= THRESHOLD_HIGH) {
            return "HIGH";
        } else if (valeur >= THRESHOLD_MEDIUM) {
            return "MEDIUM";
        } else {
            return "NORMAL";
        }
    }
}
