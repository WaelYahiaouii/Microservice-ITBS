package com.Maintenance.service;

import com.Maintenance.model.Technicien;
import com.Maintenance.repository.TechnicienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TechnicienService {
    
    @Autowired
    private TechnicienRepository technicienRepository;
    
    public List<Technicien> getAllTechniciens() {
        return technicienRepository.findAll();
    }
    
    public Optional<Technicien> getTechnicienById(String id) {
        return technicienRepository.findById(id);
    }
    
    public Technicien createTechnicien(Technicien technicien) {
        return technicienRepository.save(technicien);
    }
    
    public Technicien updateTechnicien(String id, Technicien technicien) {
        Optional<Technicien> existingTechnicien = technicienRepository.findById(id);
        if (existingTechnicien.isPresent()) {
            Technicien techToUpdate = existingTechnicien.get();
            techToUpdate.setNom(technicien.getNom());
            techToUpdate.setSpecialite(technicien.getSpecialite());
            techToUpdate.setDisponibilite(technicien.getDisponibilite());
            return technicienRepository.save(techToUpdate);
        }
        return null;
    }
    
    public void deleteTechnicien(String id) {
        technicienRepository.deleteById(id);
    }
    
    public List<Technicien> getTechniciensDisponibles() {
        return technicienRepository.findByDisponibilite(true);
    }
    
    public List<Technicien> getTechniciensBySpecialite(String specialite) {
        return technicienRepository.findBySpecialite(specialite);
    }
    
    public List<Technicien> getTechniciensByNom(String nom) {
        return technicienRepository.findByNomContainingIgnoreCase(nom);
    }
}
