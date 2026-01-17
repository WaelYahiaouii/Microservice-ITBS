import React, { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { alertesAPI, interventionsAPI, techniciensAPI } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalAlertes: 0,
    alertesCritiques: 0,
    totalInterventions: 0,
    techniciensDisponibles: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const [alertesRes, interventionsRes, techniciensRes] = await Promise.all([
        alertesAPI.getAll(),
        interventionsAPI.getAll(),
        techniciensAPI.getDisponibles()
      ]);

      const alertes = alertesRes.data;
      const critical = alertes.filter(a => a.niveauGravite === 'CRITICAL').length;

      setStats({
        totalAlertes: alertes.length,
        alertesCritiques: critical,
        totalInterventions: interventionsRes.data.length,
        techniciensDisponibles: techniciensRes.data.length
      });
    } catch (err) {
      console.error('Error loading statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Alertes</Card.Title>
              <h2>{stats.totalAlertes}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center border-danger">
            <Card.Body>
              <Card.Title>Critical Alertes</Card.Title>
              <h2 className="text-danger">{stats.alertesCritiques}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Interventions</Card.Title>
              <h2>{stats.totalInterventions}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Available Techniciens</Card.Title>
              <h2>{stats.techniciensDisponibles}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
