package com.Maintenance.repository;

import com.Maintenance.model.Intervention;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionRepository extends MongoRepository<Intervention, String> {
    List<Intervention> findByAlerteId(String alerteId);
    List<Intervention> findByTechnicienId(String technicienId);
    List<Intervention> findByStatut(String statut);
}
