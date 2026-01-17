package com.Surveillance.service;

import com.Surveillance.model.Alerte;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    private static final String EXCHANGE_NAME = "anomalie.exchange";
    private static final String ROUTING_KEY = "anomalie.nouvelle";
    
    public void publishAlerte(Alerte alerte) {
        rabbitTemplate.convertAndSend(EXCHANGE_NAME, ROUTING_KEY, alerte);
        System.out.println("Alerte published to Maintenance: " + alerte.getId());
    }
}
