import api from './api';

class BiometricsService {
  async getBiometrics() {
    try {
      const response = await api.get('/biometries/');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des données biométriques:', error);
      throw error;
    }
  }

  async getBiometricById(id) {
    try {
      const response = await api.get(`/biometries/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la biométrie:', error);
      throw error;
    }
  }

  async createBiometric(data) {
    try {
      const response = await api.post('/biometries/', data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la biométrie:', error);
      throw error;
    }
  }

  async updateBiometric(id, data) {
    try {
      const response = await api.put(`/biometries/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la biométrie:', error);
      throw error;
    }
  }

  async deleteBiometric(id) {
    try {
      await api.delete(`/biometries/${id}/`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la biométrie:', error);
      throw error;
    }
  }
}

export default new BiometricsService();
