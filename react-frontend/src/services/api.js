import axios from 'axios';

const API_CONFIG = {
  SURVEILLANCE: 'http://localhost:8080',
  MAINTENANCE: 'http://localhost:8081'
};

// Surveillance API
export const alertesAPI = {
  getAll: () => axios.get(`${API_CONFIG.SURVEILLANCE}/api/alertes`),
  create: (data) => axios.post(`${API_CONFIG.SURVEILLANCE}/api/alertes`, data),
  delete: (id) => axios.delete(`${API_CONFIG.SURVEILLANCE}/api/alertes/${id}`),
  getByNiveau: (niveauGravite) => axios.get(`${API_CONFIG.SURVEILLANCE}/api/alertes/niveau/${encodeURIComponent(niveauGravite)}`)
};

export const mesuresAPI = {
  getAll: () => axios.get(`${API_CONFIG.SURVEILLANCE}/api/mesures`),
  create: (data) => axios.post(`${API_CONFIG.SURVEILLANCE}/api/mesures`, data),
  delete: (id) => axios.delete(`${API_CONFIG.SURVEILLANCE}/api/mesures/${id}`),
  getBySource: (sourceId) => axios.get(`${API_CONFIG.SURVEILLANCE}/api/mesures/source/${encodeURIComponent(sourceId)}`)
};

// Maintenance API
export const techniciensAPI = {
  getAll: () => axios.get(`${API_CONFIG.MAINTENANCE}/api/techniciens`),
  create: (data) => axios.post(`${API_CONFIG.MAINTENANCE}/api/techniciens`, data),
  update: (id, data) => axios.put(`${API_CONFIG.MAINTENANCE}/api/techniciens/${id}`, data),
  delete: (id) => axios.delete(`${API_CONFIG.MAINTENANCE}/api/techniciens/${id}`),
  getDisponibles: () => axios.get(`${API_CONFIG.MAINTENANCE}/api/techniciens/disponibles`),
  getByNom: (nom) => axios.get(`${API_CONFIG.MAINTENANCE}/api/techniciens/nom/${encodeURIComponent(nom)}`)
};

export const interventionsAPI = {
  getAll: () => axios.get(`${API_CONFIG.MAINTENANCE}/api/interventions`),
  create: (data) => axios.post(`${API_CONFIG.MAINTENANCE}/api/interventions`, data),
  update: (id, data) => axios.put(`${API_CONFIG.MAINTENANCE}/api/interventions/${id}`, data),
  delete: (id) => axios.delete(`${API_CONFIG.MAINTENANCE}/api/interventions/${id}`),
  getByStatut: (statut) => axios.get(`${API_CONFIG.MAINTENANCE}/api/interventions/statut/${statut}`)
};
