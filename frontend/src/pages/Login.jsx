import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
// Suppression de l'import des icônes de réseaux sociaux
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

// Remplacer l'import du logo
import logo from '../assets/Nditou_logo.jpg';

import { useNavigate, useLocation } from 'react-router-dom';
import AuthService from '../services/auth';
import Header from '../components/landing/Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();
  // Après la ligne 34, ajoutez ce code pour récupérer le paramètre email_verified de l'URL
  const location = useLocation();
  
  // Vérifier s'il y a un message de succès dans l'état de navigation
  const successMessage = location.state?.message || '';
  
  // Récupérer le paramètre email_verified de l'URL
  const params = new URLSearchParams(location.search);
  const emailVerified = params.get('email_verified');

  // Ajout du hook useEffect pour initialiser le slider (exactement comme dans Register.jsx)
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

    if (!username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
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
      
      // Appel à l'API pour la connexion
      await AuthService.login(username, password);
      
      // Rediriger vers le nouveau dashboard patient après connexion
      navigate('/dashboard-patient'); // Redirection vers le nouveau dashboard dans scenes
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setApiError(error.response?.data?.message || 'Nom d\'utilisateur ou mot de passe incorrect.');
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
                    Suivez efficacement les dossiers médicaux et gérez les rendez vous de vos patients en toute simplicité.
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
        
        {/* Right side - Login Form */}
        <div className="form-section">
          <div className="mobile-logo">
            <img src={logo} alt="Logo Fenku" style={{ height: '50px', width: 'auto' }} />
          </div>
          
          <div className="form-header">
            <h1>Connexion</h1>
            <p>Entrez votre nom d'utilisateur et votre mot de passe pour accéder au votre espace personnel E-Fajma.</p>
          </div>
          
          {emailVerified === 'true' && (
            <Alert variant="success">
              Votre compte a été vérifié avec succès. Vous pouvez maintenant vous connecter.
            </Alert>
          )}
          {emailVerified === 'false' && (
            <Alert variant="danger">
              Le lien de confirmation est invalide ou a expiré.
            </Alert>
          )}
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            {/* Username Field */}
            <Form.Group className="form-group">
              <Form.Label>Nom d'utilisateur</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faUser} className="input-icon" />
                <Form.Control 
                  type="text" 
                  placeholder="Nom d'utilisateur" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  isInvalid={validated && !!errors.username}
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Password Field */}
            <Form.Group className="form-group">
              <Form.Label>Mot de passe</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <Form.Control 
                  type="password" 
                  placeholder="Mot de passe" 
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
            
            {/* Remember Me & Forgot Password */}
            <div className="form-footer">
              <div className="remember-me">
                <Form.Check 
                  type="checkbox" 
                  id="remember-me" 
                  label="Se souvenir de moi" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </div>
              <a href="/reset-password" className="forgot-password">Mot de passe oublié ?</a>
            </div>
            
            {/* Sign In Button */}
            <Button className="signin-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </Button>
            
            {/* Sign Up Link */}
            <div className="signup-link">
              Vous n'avez pas de compte ? <a href="/register">S'inscrire</a>
            </div>
            
            {/* Suppression des liens sociaux */}
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

export default Login;
