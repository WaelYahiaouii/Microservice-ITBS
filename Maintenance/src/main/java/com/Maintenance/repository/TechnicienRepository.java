package com.Maintenance.repository;

import com.Maintenance.model.Technicien;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TechnicienRepository extends MongoRepository<Technicien, String> {
    List<Technicien> findByDisponibilite(Boolean disponibilite);
    List<Technicien> findBySpecialite(String specialite);
    List<Technicien> findByNomContainingIgnoreCase(String nom);
}
