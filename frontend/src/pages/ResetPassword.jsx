import React, { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'animate.css';
import '../styles/Login.scss';

// Import slider images
import slider1 from '../assets/slider1.svg';
import slider2 from '../assets/slider2.svg';
import slider3 from '../assets/slider3.svg';

// Ajouter l'import du logo
import logo from '../assets/Nditou_logo.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';
import Header from '../components/landing/Header';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState('request'); // 'request' ou 'reset'
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Initialize Swiper
    const swiper = new Swiper('.swiper-container', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });

    return () => {
      // Cleanup Swiper instance
      if (swiper) swiper.destroy();
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (mode === 'request') {
      if (!email.trim()) {
        newErrors.email = 'L\'email est requis';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Veuillez entrer une adresse email valide';
        isValid = false;
      }
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
      
      // Simuler la demande de réinitialisation du mot de passe
      console.log('Demande de réinitialisation pour:', email);
      
      // Stocker l'email pour les étapes suivantes
      localStorage.setItem('resetEmail', email);
      
      // Rediriger vers la page de confirmation du code
      navigate('/code-confirmation');
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      setApiError(error.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="login-page">
        <div className="login-container">
        {/* Left side - Slider */}
        <div className="slider-section">
          <div className="logo" style={{ position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
            <img src={logo} alt="Logo Fenku" style={{ height: '60px', width: 'auto' }} />
          </div>
          
          <div className="swiper-container">
            <div className="swiper-wrapper">
              {/* Slide 1 */}
              <div className="swiper-slide">
                <div className="slider-content animate-fadeIn">
                  <img src={slider1} alt="Gestion des patients" className="slider-image" />
                  <h2 className="animate-fadeInUp animate-delay-1">Gestion des patients</h2>
                  <p className="animate-fadeInUp animate-delay-2">
                    Suivez efficacement les dossiers médicaux et gérez les rendez-vous de vos patients en toute simplicité.
                  </p>
                </div>
              </div>
              
              {/* Slide 2 */}
              <div className="swiper-slide">
                <div className="slider-content animate-fadeIn">
                  <img src={slider2} alt="Téléconsultation à distance" className="slider-image" />
                  <h2 className="animate-fadeInUp animate-delay-1">Téléconsultation à distance</h2>
                  <p className="animate-fadeInUp animate-delay-2">
                    Consultez vos patients à distance grâce à notre dispositif médical connecté pour un suivi optimal.
                  </p>
                </div>
              </div>
              
              {/* Slide 3 */}
              <div className="swiper-slide">
                <div className="slider-content animate-fadeIn">
                  <img src={slider3} alt="Optimiser la pratique" className="slider-image" />
                  <h2 className="animate-fadeInUp animate-delay-1">Optimisez votre pratique</h2>
                  <p className="animate-fadeInUp animate-delay-2">
                    Utilisez des outils d'analyse et de reporting puissants pour améliorer l'efficacité et les soins aux patients.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Pagination */}
            <div className="swiper-pagination"></div>
          </div>
        </div>
        
        {/* Right side - Reset Password Form */}
        <div className="form-section">
          <div className="mobile-logo">
            <img src={logo} alt="Logo Fenku" style={{ height: '50px', width: 'auto' }} />
          </div>
          
          <div className="form-header">
            <h1>Mot de passe oublié</h1>
            <p>Entrez votre adresse email pour recevoir un code de réinitialisation.</p>
          </div>
          
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <Form.Control 
                  type="email" 
                  placeholder="Adresse email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  isInvalid={validated && !!errors.email}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Submit Button */}
            <Button className="signin-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Envoi en cours...' : 'Envoyer le code de réinitialisation'}
            </Button>
            
            {/* Back to Login Link */}
            <div className="signup-link">
              <a href="/login">
                <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: '5px' }} />
                Retour à la page de connexion
              </a>
            </div>
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
