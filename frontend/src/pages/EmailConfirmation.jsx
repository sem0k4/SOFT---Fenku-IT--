import React, { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth';
import '../styles/Login.scss';
import logo from '../assets/Nditou_logo.jpg';
import Header from '../components/landing/Header';

const EmailConfirmation = () => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Récupérer l'email depuis l'état de navigation ou localStorage
  const email = location.state?.email || localStorage.getItem('registrationEmail') || '';
  
  const handleResendEmail = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setResendError('Adresse email non disponible. Veuillez vous réinscrire.');
      return;
    }
    
    try {
      setIsResending(true);
      setResendError('');
      
      // Appel à l'API pour renvoyer l'email de confirmation
      await AuthService.resendConfirmationEmail(email);
      
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000); // Masquer le message après 5 secondes
    } catch (error) {
      console.error('Erreur lors du renvoi de l\'email:', error);
      setResendError(error.response?.data?.message || 'Une erreur est survenue lors du renvoi de l\'email. Veuillez réessayer.');
    } finally {
      setIsResending(false);
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
            <img src={logo} alt="Logo Fenku" style={{ height: '60px', width: 'auto' }} />
          </div>
          
          <div className="confirmation-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: '80px', color: '#fff', marginBottom: '30px' }} />
            <h2 className="animate-fadeInUp animate-delay-1" style={{ color: '#fff', textAlign: 'center' }}>Vérifiez votre boîte de réception</h2>
            <p className="animate-fadeInUp animate-delay-2" style={{ color: '#fff', textAlign: 'center', maxWidth: '80%' }}>
              Un email de confirmation a été envoyé à {email ? <strong>{email}</strong> : 'votre adresse email'}.
            </p>
          </div>
        </div>
        
        {/* Right side - Confirmation Content */}
        <div className="form-section">
          <div className="mobile-logo">
            <img src={logo} alt="Logo Fenku" style={{ height: '50px', width: 'auto' }} />
          </div>
          
          <div className="form-header">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '60px', color: '#00A3C4', marginBottom: '20px' }} />
            <h1>Inscription réussie !</h1>
            <p>Nous vous avons envoyé un email de confirmation à l'adresse que vous avez fournie.</p>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            {resendSuccess && <Alert variant="success">Un nouvel email de confirmation a été envoyé avec succès.</Alert>}
            {resendError && <Alert variant="danger">{resendError}</Alert>}
            
            <p style={{ marginBottom: '30px' }}>
              Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation pour activer votre compte.
              Si vous ne trouvez pas l'email, veuillez vérifier votre dossier de spam.
            </p>
            
            <Button className="signin-button" onClick={() => navigate('/login')}>
              Retour à la page de connexion
            </Button>
            
            <div className="signup-link" style={{ marginTop: '20px' }}>
              Vous n'avez pas reçu l'email ? <a href="#" onClick={handleResendEmail} disabled={isResending}>
                {isResending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default EmailConfirmation;