package com.Maintenance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Document(collection = "interventions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Intervention {
    @Id
    private String id;
    
    private String alerteId;
    
    private String technicienId;
    
    private LocalDateTime datePlanifiee;
    
    private String statut; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
}
