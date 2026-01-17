package com.Surveillance.repository;

import com.Surveillance.model.MesureAnalyse;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MesureAnalyseRepository extends MongoRepository<MesureAnalyse, String> {
    List<MesureAnalyse> findBySourceId(String sourceId);
    List<MesureAnalyse> findByIndicateur(String indicateur);
}
