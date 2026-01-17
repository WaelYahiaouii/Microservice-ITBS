package com.Maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlerteDTO {
    private String id;
    private String type;
    private String message;
    private String niveauGravite;
    private LocalDateTime dateDetection;
}
