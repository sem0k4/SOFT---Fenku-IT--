import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement de l'utilisateur
    const loadUser = () => {
      try {
        // Données utilisateur simulées pour le développement
        const userData = {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          role: 'patient',
          medicalData: {
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
        
        setUser(userData);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    // Délai pour simuler le chargement
    setTimeout(loadUser, 1000);
  }, []);

  const login = async (email, password) => {
    // Simuler une connexion
    setLoading(true);
    try {
      // Dans une vraie app, appeler l'API de connexion
      const userData = {
        id: 1,
        name: 'Jean Dupont',
        email: email,
        role: 'patient'
      };
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};