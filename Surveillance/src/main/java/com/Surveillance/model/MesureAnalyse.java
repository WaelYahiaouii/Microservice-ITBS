package com.Surveillance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "mesures_analyse")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MesureAnalyse {
    @Id
    private String id;
    
    private String sourceId;
    
    private Double valeur;
    private String indicateur;
    
    private LocalDateTime date;
    
    public MesureAnalyse(String sourceId, Double valeur, String indicateur) {
        this.sourceId = sourceId;
        this.valeur = valeur;
        this.indicateur = indicateur;
        this.date = LocalDateTime.now();
    }
}
