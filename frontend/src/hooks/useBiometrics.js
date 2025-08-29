import { useState, useEffect } from 'react';
import { biometricsService } from '../services';

export default function useBiometrics() {
    const [biometrics, setBiometrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBiometrics = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Vérifier si l'utilisateur est authentifié
                const token = localStorage.getItem('access');
                if (!token) {
                    setError('Authentification requise');
                    return;
                }
                
                const data = await biometricsService.getBiometrics();
                setBiometrics(data);
            } catch (err) {
                setError('Erreur lors de la récupération des données biométriques');
                console.error('Erreur biométriques:', err);
                console.error('Détails de l\'erreur:', err.response?.data);
            } finally {
                setLoading(false);
            }
        };

        fetchBiometrics();
    }, []);

    const refetch = async () => {
        const fetchBiometrics = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const token = localStorage.getItem('access');
                if (!token) {
                    setError('Authentification requise');
                    return;
                }
                
                const data = await biometricsService.getBiometrics();
                setBiometrics(data);
            } catch (err) {
                setError('Erreur lors de la récupération des données biométriques');
                console.error('Erreur biométriques:', err);
                console.error('Détails de l\'erreur:', err.response?.data);
            } finally {
                setLoading(false);
            }
        };
        
        await fetchBiometrics();
    };

    return { biometrics, loading, error, refetch };
}