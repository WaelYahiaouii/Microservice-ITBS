import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Form, Modal, Alert } from 'react-bootstrap';
import { techniciensAPI } from '../services/api';

function Techniciens() {
  const [techniciens, setTechniciens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTechnicien, setEditingTechnicien] = useState(null);
  const [filterDisponibilite, setFilterDisponibilite] = useState('');
  const [filterNom, setFilterNom] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    specialite: '',
    disponibilite: true
  });

  useEffect(() => {
    loadTechniciens();
    const interval = setInterval(loadTechniciens, 10000);
    return () => clearInterval(interval);
  }, [filterDisponibilite, filterNom]);

  const loadTechniciens = async () => {
    try {
      setLoading(true);
      let response;
      if (filterDisponibilite) {
        response = await techniciensAPI.getDisponibles();
      } else if (filterNom) {
        response = await techniciensAPI.getByNom(filterNom);
      } else {
        response = await techniciensAPI.getAll();
      }
      let data = response.data;
      
      // Client-side filtering if both filters are active
      if (filterDisponibilite && filterNom) {
        data = data.filter(t => 
          t.disponibilite === (filterDisponibilite === 'true') &&
          t.nom?.toLowerCase().includes(filterNom.toLowerCase())
        );
      } else if (filterDisponibilite) {
        data = data.filter(t => t.disponibilite === (filterDisponibilite === 'true'));
      } else if (filterNom) {
        data = data.filter(t => t.nom?.toLowerCase().includes(filterNom.toLowerCase()));
      }
      
      setTechniciens(data);
      setError(null);
    } catch (err) {
      setError('Unable to load techniciens');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTechnicien(null);
    setFormData({ nom: '', specialite: '', disponibilite: true });
    setShowModal(true);
  };

  const handleEdit = (tech) => {
    setEditingTechnicien(tech);
    setFormData({
      nom: tech.nom || '',
      specialite: tech.specialite || '',
      disponibilite: tech.disponibilite !== undefined ? tech.disponibilite : true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTechnicien) {
        await techniciensAPI.update(editingTechnicien.id, formData);
        setSuccess('Technicien updated successfully');
      } else {
        await techniciensAPI.create(formData);
        setSuccess('Technicien created successfully');
      }
      setShowModal(false);
      loadTechniciens();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Error during operation');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this technicien?')) {
      try {
        await techniciensAPI.delete(id);
        setSuccess('Technicien deleted');
        loadTechniciens();
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Error during deletion');
      }
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Techniciens Management</h2>
        <Button variant="primary" onClick={handleCreate}>+ New Technicien</Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <div className="mb-3 d-flex gap-2">
        <Form.Select 
          value={filterDisponibilite} 
          onChange={(e) => setFilterDisponibilite(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All</option>
          <option value="true">Available</option>
          <option value="false">Unavailable</option>
        </Form.Select>
        <Form.Control
          type="text"
          placeholder="Filter by name"
          value={filterNom}
          onChange={(e) => setFilterNom(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        {(filterDisponibilite || filterNom) && (
          <Button variant="secondary" onClick={() => { setFilterDisponibilite(''); setFilterNom(''); }}>
            Reset
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : techniciens.length === 0 ? (
        <Card>
          <Card.Body className="text-center">No techniciens at the moment</Card.Body>
        </Card>
      ) : (
        <Row>
          {techniciens.map(tech => (
            <Col md={4} key={tech.id} className="mb-3">
              <Card className="card-hover h-100">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <strong>{tech.nom || 'Technicien'}</strong>
                  <Badge bg={tech.disponibilite ? 'success' : 'danger'}>
                    {tech.disponibilite ? 'Available' : 'Unavailable'}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <p><strong>Specialty:</strong> {tech.specialite || 'N/A'}</p>
                  <p><strong>ID:</strong> {tech.id}</p>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleEdit(tech)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(tech.id)}
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
          <Modal.Title>{editingTechnicien ? 'Edit Technicien' : 'New Technicien'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                placeholder="Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Specialty</Form.Label>
              <Form.Control
                type="text"
                value={formData.specialite}
                onChange={(e) => setFormData({...formData, specialite: e.target.value})}
                placeholder="Specialty"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Availability</Form.Label>
              <Form.Select
                value={formData.disponibilite}
                onChange={(e) => setFormData({...formData, disponibilite: e.target.value === 'true'})}
                required
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant="primary" type="submit">
              {editingTechnicien ? 'Update' : 'Create'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Techniciens;
