package com.Surveillance.repository;

import com.Surveillance.model.Alerte;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlerteRepository extends MongoRepository<Alerte, String> {
    List<Alerte> findByNiveauGravite(String niveauGravite);
    List<Alerte> findByType(String type);
}
