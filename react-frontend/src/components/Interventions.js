import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { interventionsAPI, alertesAPI, techniciensAPI } from '../services/api';

function Interventions() {
  const [interventions, setInterventions] = useState([]);
  const [alertes, setAlertes] = useState([]);
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState(null);
  const [filterStatut, setFilterStatut] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    alerteId: '',
    technicienId: '',
    datePlanifiee: '',
    statut: 'SCHEDULED'
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [filterStatut]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load alertes and techniciens for dropdowns
      const [alertesRes, techniciensRes] = await Promise.all([
        alertesAPI.getAll().catch(() => ({ data: [] })),
        techniciensAPI.getAll().catch(() => ({ data: [] }))
      ]);
      setAlertes(alertesRes.data);
      setTechniciens(techniciensRes.data);
      
      // Load interventions
      let response;
      if (filterStatut) {
        response = await interventionsAPI.getByStatut(filterStatut);
      } else {
        response = await interventionsAPI.getAll();
      }
      let data = response.data;
      
      // Client-side filtering if both filters are active
      if (filterStatut) {
        data = data.filter(i => 
          i.statut === filterStatut
        );
      }
      
      setInterventions(data);
      setError(null);
    } catch (err) {
      setError('Unable to load interventions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingIntervention(null);
    setFormData({
      alerteId: '',
      technicienId: '',
      datePlanifiee: '',
      statut: 'SCHEDULED'
    });
    setShowModal(true);
  };

  const handleEdit = (inter) => {
    setEditingIntervention(inter);
    const datePlanifiee = inter.datePlanifiee 
      ? new Date(inter.datePlanifiee).toISOString().slice(0, 16)
      : '';
    setFormData({
      alerteId: inter.alerteId || '',
      technicienId: inter.technicienId || '',
      datePlanifiee: datePlanifiee,
      statut: inter.statut || 'SCHEDULED'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        datePlanifiee: new Date(formData.datePlanifiee).toISOString()
      };
      if (editingIntervention) {
        await interventionsAPI.update(editingIntervention.id, data);
        setSuccess('Intervention updated successfully');
      } else {
        await interventionsAPI.create(data);
        setSuccess('Intervention created successfully');
      }
      setShowModal(false);
      loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error during operation: ' + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this intervention?')) {
      try {
        await interventionsAPI.delete(id);
        setSuccess('Intervention deleted');
        loadData();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Error during deletion');
      }
    }
  };

  const getBadgeVariant = (statut) => {
    switch(statut) {
      case 'SCHEDULED': return 'primary';
      case 'IN_PROGRESS': return 'warning';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US');
  };

  const getAlerteType = (alerteId) => {
    if (!alerteId) return 'N/A';
    const alerte = alertes.find(a => a.id === alerteId);
    return alerte ? alerte.type : 'N/A';
  };

  const getTechnicienNom = (technicienId) => {
    if (!technicienId) return 'N/A';
    const technicien = techniciens.find(t => t.id === technicienId);
    return technicien ? technicien.nom : 'N/A';
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Interventions Management</h2>
        <Button variant="primary" onClick={handleCreate}>+ New Intervention</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <div className="mb-3 d-flex gap-2">
        <Form.Select 
          value={filterStatut} 
          onChange={(e) => setFilterStatut(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All statuses</option>
          <option value="SCHEDULED">SCHEDULED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="CANCELLED">CANCELLED</option>
        </Form.Select>
        {(filterStatut) && (
          <Button variant="secondary" onClick={() => { setFilterStatut(''); }}>
            Reset
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : interventions.length === 0 ? (
        <Card>
          <Card.Body className="text-center">No interventions at the moment</Card.Body>
        </Card>
      ) : (
        <Row>
          {interventions.map(inter => (
            <Col md={4} key={inter.id} className="mb-3">
              <Card className="card-hover h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>Intervention ID: {inter.id}</strong>
                  <Badge bg={getBadgeVariant(inter.statut)}>
                    {inter.statut || 'N/A'}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <p><strong>Alerte Type:</strong> {getAlerteType(inter.alerteId)}</p>
                  <p><strong>Technicien:</strong> {getTechnicienNom(inter.technicienId)}</p>
                  <p><strong>Scheduled Date:</strong> {formatDate(inter.datePlanifiee)}</p>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(inter)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(inter.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingIntervention ? 'Edit Intervention' : 'New Intervention'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Alerte</Form.Label>
              <Form.Select
                value={formData.alerteId}
                onChange={(e) => setFormData({...formData, alerteId: e.target.value})}
                required
              >
                <option value="">Select an alerte</option>
                {alertes.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.type} "{a.niveauGravite}"
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Technicien</Form.Label>
              <Form.Select
                value={formData.technicienId}
                onChange={(e) => setFormData({...formData, technicienId: e.target.value})}
                required
              >
                <option value="">Select a technicien</option>
                {techniciens.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nom} - {t.specialite}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Scheduled Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.datePlanifiee}
                onChange={(e) => setFormData({...formData, datePlanifiee: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={formData.statut}
                onChange={(e) => setFormData({...formData, statut: e.target.value})}
                required
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingIntervention ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Interventions;
