package com.Surveillance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "alertes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Alerte {
    @Id
    private String id;
    
    private String type;
    private String message;
    
    private String niveauGravite;
    
    private LocalDateTime dateDetection;
    
    public Alerte(String type, String message, String niveauGravite) {
        this.type = type;
        this.message = message;
        this.niveauGravite = niveauGravite;
        this.dateDetection = LocalDateTime.now();
    }
}
