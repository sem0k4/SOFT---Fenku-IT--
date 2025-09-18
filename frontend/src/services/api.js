// Service API simple pour le développement
// Dans un environnement de production, ceci serait remplacé par de vrais appels API

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
    this.timeout = 10000;
  }

  // Simuler un délai de réseau
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Méthode GET simulée
  async get(endpoint) {
    await this.delay();
    
    // Simuler des données selon l'endpoint
    if (endpoint === '/medical-data/') {
      return {
        data: {
          allergies: [
            { name: 'Pollens', type: 'saisonnière', severity: 'modérée' },
            { name: 'Pénicilline', type: 'médicamenteuse', severity: 'sévère' }
          ],
          medications: [
            { name: 'Metformine', dosage: '500mg', frequency: '2x/jour' },
            { name: 'Lisinopril', dosage: '10mg', frequency: '1x/jour' }
          ],
          medicalHistory: [
            { condition: 'Diabète de type 2', date: '2020', status: 'En cours' },
            { condition: 'Hypertension artérielle', date: '2019', status: 'Contrôlée' }
          ],
          appointments: [
            { date: '2024-01-15', time: '14:30', doctor: 'Dr. Martin', type: 'Consultation générale' }
          ]
        }
      };
    }

    // Endpoint par défaut
    return { data: {} };
  }

  // Méthode POST simulée
  async post(endpoint, data) {
    await this.delay();
    return { data: { success: true, ...data } };
  }

  // Méthode PUT simulée
  async put(endpoint, data) {
    await this.delay();
    return { data: { success: true, ...data } };
  }

  // Méthode DELETE simulée
  async delete(endpoint) {
    await this.delay();
    return { data: { success: true } };
  }
}

// Créer une instance unique
const api = new ApiService();

export { api };
export default api;
