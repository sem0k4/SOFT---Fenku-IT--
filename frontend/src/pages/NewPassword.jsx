import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Login.scss'; // Réutilisation du même style
// Ajouter l'import du logo manquant
import logo from '../assets/Nditou_logo.jpg';
import Header from '../components/landing/Header';

const NewPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Vérifier si les mots de passe correspondent
  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  // Vérifier si l'email et le code sont disponibles
  useEffect(() => {
    const email = localStorage.getItem('resetEmail');
    const code = localStorage.getItem('resetCode');
    
    if (!email || !code) {
      setApiError('Informations manquantes. Veuillez recommencer le processus de réinitialisation.');
      // Ajouter une redirection après un court délai
      setTimeout(() => {
        navigate('/reset-password');
      }, 3000);
    }
  }, [navigate]); // Ajouter navigate comme dépendance

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setApiError('');

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      
      // Récupérer l'email et le code depuis le localStorage
      const email = localStorage.getItem('resetEmail');
      const code = localStorage.getItem('resetCode');
      
      if (!email || !code) {
        setApiError('Informations manquantes. Veuillez recommencer le processus de réinitialisation.');
        return;
      }
      
      // Appel à l'API pour définir le nouveau mot de passe
      await authService.setNewPassword(email, code, password);
      
      // Nettoyer le localStorage
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('resetCode');
      
      // Rediriger vers la page de connexion avec un message de succès
      navigate('/login', { state: { message: 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.' } });
    } catch (error) {
      console.error('Erreur lors de la définition du nouveau mot de passe:', error);
      setApiError(error.response?.data?.message || 'Erreur lors de la définition du nouveau mot de passe. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-container">
        {/* Left side - Colored Section */}
        <div className="slider-section">
          <div className="logo" style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <img src={logo} alt="Nditou Logo" style={{ height: '60px', width: 'auto' }} />
          </div>
          
          <div className="confirmation-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <FontAwesomeIcon icon={faLock} style={{ fontSize: '80px', color: '#fff', marginBottom: '30px' }} />
            <h2 className="animate-fadeInUp animate-delay-1" style={{ color: '#00A3C4', textAlign: 'center' }}>Sécurité du compte</h2>
            <p className="animate-fadeInUp animate-delay-2" style={{ color: '#00A3C4', textAlign: 'center', maxWidth: '80%' }}>
              Créez un nouveau mot de passe sécurisé pour votre compte.
            </p>
          </div>
        </div>
        
        {/* Right side - New Password Form */}
        <div className="form-section">
          <div className="mobile-logo">
            <img src={logo} alt="Nditou Logo" style={{ height: '50px', width: 'auto' }} />
          </div>
          {/* Supprimer ce logo supplémentaire qui crée une duplication */}
          {/* <div className="logo" style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>E FAJMA</h1>
          </div> */}
          
          <div className="form-header">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '60px', color: '#00A3C4', marginBottom: '20px' }} />
            <h1>Créer un nouveau mot de passe</h1>
            <p>Veuillez définir un nouveau mot de passe pour votre compte.</p>
          </div>
          
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="form-group">
              <Form.Label>Nouveau mot de passe</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <Form.Control 
                  type="password" 
                  placeholder="Nouveau mot de passe" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  isInvalid={validated && !!errors.password}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            <Form.Group className="form-group">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <Form.Control 
                  type="password" 
                  placeholder="Confirmer le mot de passe" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  isInvalid={validated && (!!errors.confirmPassword || !passwordsMatch)}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword || (!passwordsMatch && 'Les mots de passe ne correspondent pas.')}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            <Button className="signin-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Traitement en cours...' : 'Définir le nouveau mot de passe'}
            </Button>
            
            <div className="signup-link">
              <a href="/login">Retour à la page de connexion</a>
            </div>
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

export default NewPassword;