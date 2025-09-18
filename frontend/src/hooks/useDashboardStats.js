import { useState, useEffect } from 'react';
import { api } from '../services';

const useDashboardStats = () => {
    const [dashboardStats, setDashboardStats] = useState({
        totalConsultations: 0,
        totalTeleconsultations: 0,
        nextAppointment: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fonction pour récupérer les statistiques du tableau de bord
    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // Simuler des données de statistiques pour le moment
            const mockStats = {
                totalConsultations: 15,
                totalTeleconsultations: 8,
                nextAppointment: {
                    date: '2024-01-20',
                    time: '14:30',
                    doctor: 'Dr. Martin',
                    type: 'Consultation générale'
                }
            };
            
            setDashboardStats(mockStats);
            return mockStats;
        } catch (err) {
            setError('Erreur lors de la récupération des statistiques');
            console.error('Erreur fetchDashboardStats:', err);
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Charger les statistiques au montage du composant
    useEffect(() => {
        fetchDashboardStats();
    }, []);

    return {
        dashboardStats,
        loading,
        error,
        fetchDashboardStats,
        setDashboardStats,
        setError
    };
};

export default useDashboardStats;
