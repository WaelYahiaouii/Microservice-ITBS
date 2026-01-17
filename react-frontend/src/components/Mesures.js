import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { mesuresAPI } from '../services/api';

function Mesures() {
  const [mesures, setMesures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMesure, setEditingMesure] = useState(null);
  const [filterSource, setFilterSource] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    sourceId: '',
    valeur: '',
    indicateur: ''
  });

  useEffect(() => {
    loadMesures();
    const interval = setInterval(loadMesures, 10000);
    return () => clearInterval(interval);
  }, [filterSource]);

  const loadMesures = async () => {
    try {
      setLoading(true);
      const response = filterSource 
        ? await mesuresAPI.getBySource(filterSource)
        : await mesuresAPI.getAll();
      setMesures(response.data);
      setError(null);
    } catch (err) {
      setError('Unable to load mesures');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingMesure(null);
    setFormData({ sourceId: '', valeur: '', indicateur: '' });
    setShowModal(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        valeur: parseFloat(formData.valeur)
      };
      if (editingMesure) {
        await mesuresAPI.update(editingMesure.id, data);
        setSuccess('Mesure updated successfully');
      } else {
        await mesuresAPI.create(data);
        setSuccess('Mesure created successfully');
      }
      setShowModal(false);
      loadMesures();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error during operation');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this mesure?')) {
      try {
        await mesuresAPI.delete(id);
        setSuccess('Mesure deleted');
        loadMesures();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Error during deletion');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Analysis Measures</h2>
        <Button variant="primary" onClick={handleCreate}>+ New Mesure</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder="Filter by source"
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : mesures.length === 0 ? (
        <Card>
          <Card.Body className="text-center">No mesures at the moment</Card.Body>
        </Card>
      ) : (
        <Row>
          {mesures.map(mesure => (
            <Col md={4} key={mesure.id} className="mb-3">
              <Card className="card-hover h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>{mesure.indicateur || 'Mesure'}</strong>
                  <Badge bg="primary">{mesure.valeur?.toFixed(2)}</Badge>
                </Card.Header>
                <Card.Body>
                  <p><strong>Source:</strong> {mesure.sourceId || 'N/A'}</p>
                  <p><strong>Value:</strong> {mesure.valeur || 'N/A'}</p>
                  <p><strong>Date:</strong> {formatDate(mesure.date)}</p>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(mesure.id)}
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
          <Modal.Title>{editingMesure ? 'Edit Mesure' : 'New Mesure'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Alert variant="warning">
              ⚠️ A mesure with value ≥ 60 will automatically trigger an alerte!
            </Alert>
            <Form.Group className="mb-3">
              <Form.Label>Source ID</Form.Label>
              <Form.Control
                type="text"
                value={formData.sourceId}
                onChange={(e) => setFormData({...formData, sourceId: e.target.value})}
                placeholder="Source ID"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                value={formData.valeur}
                onChange={(e) => setFormData({...formData, valeur: e.target.value})}
                placeholder="Value"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Indicator</Form.Label>
              <Form.Control
                type="text"
                value={formData.indicateur}
                onChange={(e) => setFormData({...formData, indicateur: e.target.value})}
                placeholder="Indicator"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingMesure ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Mesures;
