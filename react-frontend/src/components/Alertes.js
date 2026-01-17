import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { alertesAPI } from '../services/api';

function Alertes() {
  const [alertes, setAlertes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAlerte, setEditingAlerte] = useState(null);
  const [filterNiveauGravite, setFilterNiveauGravite] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    message: '',
    niveauGravite: 'MEDIUM'
  });

  useEffect(() => {
    loadAlertes();
    const interval = setInterval(loadAlertes, 10000);
    return () => clearInterval(interval);
  }, [filterNiveauGravite]);

  const loadAlertes = async () => {
    try {
      setLoading(true);
      const response = filterNiveauGravite 
        ? await alertesAPI.getByNiveau(filterNiveauGravite)
        : await alertesAPI.getAll();
      setAlertes(response.data);
      setError(null);
    } catch (err) {
      setError('Unable to load alertes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingAlerte(null);
    setFormData({ type: '', message: '', niveauGravite: 'MEDIUM' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAlerte) {
        await alertesAPI.update(editingAlerte.id, formData);
        setSuccess('Alerte updated successfully');
      } else {
        await alertesAPI.create(formData);
        setSuccess('Alerte created successfully');
      }
      setShowModal(false);
      loadAlertes();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error during operation');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alerte?')) {
      try {
        await alertesAPI.delete(id);
        setSuccess('Alerte deleted');
        loadAlertes();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Error during deletion');
      }
    }
  };

  const getBadgeVariant = (level) => {
    switch(level) {
      case 'CRITICAL': return 'danger';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Alertes Management</h2>
        <Button variant="primary" onClick={handleCreate}>+ New Alerte</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <div className="mb-3">
        <Form.Select 
          value={filterNiveauGravite} 
          onChange={(e) => setFilterNiveauGravite(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          <option value="">All levels</option>
          <option value="CRITICAL">CRITICAL</option>
          <option value="HIGH">HIGH</option>
          <option value="MEDIUM">MEDIUM</option>
        </Form.Select>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : alertes.length === 0 ? (
        <Card>
          <Card.Body className="text-center">No alertes at the moment</Card.Body>
        </Card>
      ) : (
        <Row>
          {alertes.map(alerte => (
            <Col md={4} key={alerte.id} className="mb-3">
              <Card className="card-hover h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>{alerte.type || 'Alerte'}</strong>
                  <Badge bg={getBadgeVariant(alerte.niveauGravite)}>
                    {alerte.niveauGravite || 'N/A'}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <p><strong>Message:</strong> {alerte.message || 'N/A'}</p>
                  <p><strong>Date:</strong> {formatDate(alerte.dateDetection)}</p>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(alerte.id)}
                  >
                    Delete
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingAlerte ? 'Edit Alerte' : 'New Alerte'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Control
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                placeholder="Type"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                placeholder="Message"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Severity Level</Form.Label>
              <Form.Select
                value={formData.niveauGravite}
                onChange={(e) => setFormData({...formData, niveauGravite: e.target.value})}
                required
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingAlerte ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Alertes;
