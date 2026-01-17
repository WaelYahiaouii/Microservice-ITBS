package com.Maintenance.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Document(collection = "techniciens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Technicien {
    @Id
    private String id;
    
    private String nom;
    private String specialite;
    private Boolean disponibilite;
}
