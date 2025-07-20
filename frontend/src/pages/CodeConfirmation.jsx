<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
// Ajouter en haut du fichier avec les autres imports
import logo from '../assets/Nditou_logo.jpg';
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Login.scss'; // Réutilisation du même style
import Header from '../components/landing/Header';

const CodeConfirmation = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Fonction pour gérer le changement dans les champs de code
  const handleCodeChange = (index, value) => {
    // Vérifier que la valeur est un chiffre
    if (value !== '' && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Focus automatique sur le champ suivant
    if (value !== '' && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  // Fonction pour gérer la touche Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  // Fonction pour valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Vérifier que tous les champs sont remplis
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '') {
        newErrors[`code${i}`] = 'Requis';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setApiError('');

    if (!validateForm()) {
      return;
    }

    // Concaténer le code
    const fullCode = code.join('');
    
    try {
      setIsLoading(true);
      // Récupérer l'email depuis le localStorage (stocké lors de la demande de réinitialisation)
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        setApiError('Email non trouvé. Veuillez recommencer le processus de réinitialisation.');
        return;
      }
      
      // Appel à l'API pour vérifier le code
      const response = await authService.verifyResetCode(email, fullCode);
      
      // Stocker le code vérifié pour l'étape suivante
      localStorage.setItem('resetCode', fullCode);
      
      // Rediriger vers la page de définition de nouveau mot de passe
      navigate('/new-password');
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      setApiError(error.response?.data?.message || 'Code de vérification incorrect. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour renvoyer le code
  const handleResendCode = async (e) => {
    e.preventDefault();
    setApiError('');
    
    try {
      setIsLoading(true);
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        setApiError('Email non trouvé. Veuillez recommencer le processus de réinitialisation.');
        return;
      }
      
      // Appel à l'API pour renvoyer le code
      await authService.requestPasswordReset(email);
      alert('Un nouveau code a été envoyé à votre adresse email.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code:', error);
      setApiError(error.response?.data?.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.');
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
            <h2 className="animate-fadeInUp animate-delay-1" style={{ color: '#fff', textAlign: 'center' }}>Vérification de sécurité</h2>
            <p className="animate-fadeInUp animate-delay-2" style={{ color: '#fff', textAlign: 'center', maxWidth: '80%' }}>
              Un code de vérification à 6 chiffres a été envoyé à votre adresse email.
            </p>
          </div>
        </div>
        
        {/* Right side - Code Input Content */}
        <div className="form-section">
          <div className="mobile-logo">
            <h1>E FAJMA</h1>
          </div>
          
          <div className="form-header">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '60px', color: '#00A3C4', marginBottom: '20px' }} />
            <h1>Entrez le code de vérification</h1>
            <p>Nous avons envoyé un code à 6 chiffres à votre adresse email pour réinitialiser votre mot de passe.</p>
          </div>
          
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="code-input-container" style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '30px 0' }}>
              {code.map((digit, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <Form.Control
                    id={`code-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    isInvalid={validated && !!errors[`code${index}`]}
                    required
                    style={{
                      width: '45px',
                      height: '55px',
                      textAlign: 'center',
                      fontSize: '24px',
                      borderRadius: '8px'
                    }}
                    disabled={isLoading}
                  />
                  {validated && !!errors[`code${index}`] && (
                    <div className="invalid-tooltip" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', whiteSpace: 'nowrap' }}>
                      {errors[`code${index}`]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button className="signin-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Vérification...' : 'Vérifier le code'}
            </Button>
            
            <div className="signup-link" style={{ marginTop: '20px', textAlign: 'center' }}>
              Vous n'avez pas reçu le code ? <a href="#" onClick={handleResendCode} disabled={isLoading}>Renvoyer le code</a>
            </div>
            
            <div className="signup-link">
              <a href="/reset-password">Retour à la demande de réinitialisation</a>
            </div>
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

export default CodeConfirmation;
<div className="logo" style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
  <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>E FAJMA</h1>
<<<<<<< HEAD
=======
// Ajouter en haut du fichier avec les autres imports
import logo from '../assets/Nditou_logo.jpg';
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import '../styles/Login.scss'; // Réutilisation du même style
import Header from '../components/landing/Header';

const CodeConfirmation = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  // Fonction pour gérer le changement dans les champs de code
  const handleCodeChange = (index, value) => {
    // Vérifier que la valeur est un chiffre
    if (value !== '' && !/^\d$/.test(value)) {
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Focus automatique sur le champ suivant
    if (value !== '' && index < 5) {
      document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  // Fonction pour gérer la touche Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && index > 0 && code[index] === '') {
      document.getElementById(`code-input-${index - 1}`).focus();
    }
  };

  // Fonction pour valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Vérifier que tous les champs sont remplis
    for (let i = 0; i < code.length; i++) {
      if (code[i] === '') {
        newErrors[`code${i}`] = 'Requis';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // Fonction pour soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setApiError('');

    if (!validateForm()) {
      return;
    }

    // Concaténer le code
    const fullCode = code.join('');
    
    try {
      setIsLoading(true);
      // Récupérer l'email depuis le localStorage (stocké lors de la demande de réinitialisation)
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        setApiError('Email non trouvé. Veuillez recommencer le processus de réinitialisation.');
        return;
      }
      
      // Appel à l'API pour vérifier le code
      const response = await authService.verifyResetCode(email, fullCode);
      
      // Stocker le code vérifié pour l'étape suivante
      localStorage.setItem('resetCode', fullCode);
      
      // Rediriger vers la page de définition de nouveau mot de passe
      navigate('/new-password');
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      setApiError(error.response?.data?.message || 'Code de vérification incorrect. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour renvoyer le code
  const handleResendCode = async (e) => {
    e.preventDefault();
    setApiError('');
    
    try {
      setIsLoading(true);
      const email = localStorage.getItem('resetEmail');
      
      if (!email) {
        setApiError('Email non trouvé. Veuillez recommencer le processus de réinitialisation.');
        return;
      }
      
      // Appel à l'API pour renvoyer le code
      await authService.requestPasswordReset(email);
      alert('Un nouveau code a été envoyé à votre adresse email.');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code:', error);
      setApiError(error.response?.data?.message || 'Erreur lors de l\'envoi du code. Veuillez réessayer.');
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
            <h2 className="animate-fadeInUp animate-delay-1" style={{ color: '#fff', textAlign: 'center' }}>Vérification de sécurité</h2>
            <p className="animate-fadeInUp animate-delay-2" style={{ color: '#fff', textAlign: 'center', maxWidth: '80%' }}>
              Un code de vérification à 6 chiffres a été envoyé à votre adresse email.
            </p>
          </div>
        </div>
        
        {/* Right side - Code Input Content */}
        <div className="form-section">
          <div className="mobile-logo">
            <h1>E FAJMA</h1>
          </div>
          
          <div className="form-header">
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '60px', color: '#00A3C4', marginBottom: '20px' }} />
            <h1>Entrez le code de vérification</h1>
            <p>Nous avons envoyé un code à 6 chiffres à votre adresse email pour réinitialiser votre mot de passe.</p>
          </div>
          
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <div className="code-input-container" style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '30px 0' }}>
              {code.map((digit, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <Form.Control
                    id={`code-input-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    isInvalid={validated && !!errors[`code${index}`]}
                    required
                    style={{
                      width: '45px',
                      height: '55px',
                      textAlign: 'center',
                      fontSize: '24px',
                      borderRadius: '8px'
                    }}
                    disabled={isLoading}
                  />
                  {validated && !!errors[`code${index}`] && (
                    <div className="invalid-tooltip" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', fontSize: '10px', whiteSpace: 'nowrap' }}>
                      {errors[`code${index}`]}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button className="signin-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Vérification...' : 'Vérifier le code'}
            </Button>
            
            <div className="signup-link" style={{ marginTop: '20px', textAlign: 'center' }}>
              Vous n'avez pas reçu le code ? <a href="#" onClick={handleResendCode} disabled={isLoading}>Renvoyer le code</a>
            </div>
            
            <div className="signup-link">
              <a href="/reset-password">Retour à la demande de réinitialisation</a>
            </div>
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

export default CodeConfirmation;
<div className="logo" style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
  <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>E FAJMA</h1>
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
</div>