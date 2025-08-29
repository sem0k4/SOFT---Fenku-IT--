import api from './api';

class IoTService {
    // Récupérer tous les capteurs de l'utilisateur connecté
    async getUserSensors() {
        try {
            const response = await api.get('/capteurs/');
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des capteurs:', error);
            throw error;
        }
    }

    // Récupérer les dernières données d'un capteur spécifique
    async getLatestData(sensorId) {
        try {
            const response = await api.get(`/capteurs-iot/${sensorId}/latest-data/`);
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des dernières données:', error);
            throw error;
        }
    }

    // Récupérer l'historique des données d'un capteur
    async getSensorHistory(sensorId, startDate, endDate) {
        try {
            const params = {};
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;
            
            const response = await api.get(`/capteurs-iot/${sensorId}/history/`, { params });
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'historique:', error);
            throw error;
        }
    }

    // Enregistrer un nouveau capteur
    async registerSensor(sensorData) {
        try {
            const response = await api.post('/capteurs-iot/', sensorData);
            return response;
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du capteur:', error);
            throw error;
        }
    }

    // Mettre à jour un capteur
    async updateSensor(sensorId, sensorData) {
        try {
            const response = await api.put(`/capteurs-iot/${sensorId}/`, sensorData);
            return response;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du capteur:', error);
            throw error;
        }
    }

    // Supprimer un capteur
    async deleteSensor(sensorId) {
        try {
            const response = await api.delete(`/capteurs-iot/${sensorId}/`);
            return response;
        } catch (error) {
            console.error('Erreur lors de la suppression du capteur:', error);
            throw error;
        }
    }

    // Récupérer les alertes IoT
    async getAlerts() {
        try {
            const response = await api.get('/capteurs-iot/alerts/');
            return response;
        } catch (error) {
            console.error('Erreur lors de la récupération des alertes:', error);
            throw error;
        }
    }

    // Configurer les seuils d'alerte pour un capteur
    async setAlertThresholds(sensorId, thresholds) {
        try {
            const response = await api.post(`/capteurs-iot/${sensorId}/thresholds/`, thresholds);
            return response;
        } catch (error) {
            console.error('Erreur lors de la configuration des seuils:', error);
            throw error;
        }
    }

    // Envoyer des données de capteur (pour les tests)
    async sendSensorData(sensorId, data) {
        try {
            const response = await api.post(`/capteurs-iot/${sensorId}/data/`, data);
            return response;
        } catch (error) {
            console.error('Erreur lors de l\'envoi des données:', error);
            throw error;
        }
    }
}

export default new IoTService();