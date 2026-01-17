import React, { useState } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Alertes from './components/Alertes';
import Mesures from './components/Mesures';
import Techniciens from './components/Techniciens';
import Interventions from './components/Interventions';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('alertes');

  const renderContent = () => {
    switch (activeTab) {
      case 'alertes':
        return <Alertes />;
      case 'mesures':
        return <Mesures />;
      case 'techniciens':
        return <Techniciens />;
      case 'interventions':
        return <Interventions />;
      default:
        return <Alertes />;
    }
  };

  return (
    <div className="App">
      <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand>Anomaly Management</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                active={activeTab === 'alertes'} 
                onClick={() => setActiveTab('alertes')}
              >
                Alertes
              </Nav.Link>
              <Nav.Link 
                active={activeTab === 'mesures'} 
                onClick={() => setActiveTab('mesures')}
              >
                Mesures
              </Nav.Link>
              <Nav.Link 
                active={activeTab === 'techniciens'} 
                onClick={() => setActiveTab('techniciens')}
              >
                Techniciens
              </Nav.Link>
              <Nav.Link 
                active={activeTab === 'interventions'} 
                onClick={() => setActiveTab('interventions')}
              >
                Interventions
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        {renderContent()}
      </Container>
    </div>
  );
}

export default App;
