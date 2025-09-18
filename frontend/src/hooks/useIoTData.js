import { useState, useEffect } from 'react';
import { iotService } from '../services';

const useIoTData = () => {
    const [iotData, setIotData] = useState(null);
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les capteurs de l'utilisateur
    const fetchUserSensors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await iotService.getUserSensors();
            setSensors(response.data || []);
            return response.data;
        } catch (err) {
            setError('Erreur lors de la récupération des capteurs');
            console.error('Erreur fetchUserSensors:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer les données d'un capteur spécifique
    const fetchSensorData = async (sensorId) => {
        try {
            setLoading(true);
            setError(null);
            const response = await iotService.getLatestData(sensorId);
            setIotData(response.data);
            return response.data;
        } catch (err) {
            setError('Erreur lors de la récupération des données du capteur');
            console.error('Erreur fetchSensorData:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer l'historique des données d'un capteur
    const fetchSensorHistory = async (sensorId, startDate, endDate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await iotService.getSensorHistory(sensorId, startDate, endDate);
            return response.data;
        } catch (err) {
            setError('Erreur lors de la récupération de l\'historique');
            console.error('Erreur fetchSensorHistory:', err);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Charger les capteurs au montage du composant
    useEffect(() => {
        fetchUserSensors();
    }, []);

    return {
        iotData,
        sensors,
        loading,
        error,
        fetchUserSensors,
        fetchSensorData,
        fetchSensorHistory,
        setIotData,
        setSensors,
        setError
    };
};

export default useIoTData;
