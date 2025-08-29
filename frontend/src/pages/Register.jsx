<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'animate.css';
import '../styles/Login.scss';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

// Import slider images
import slider1 from '../assets/slider1.svg';
import slider2 from '../assets/slider2.svg';
import slider3 from '../assets/slider3.svg';

// Ajouter l'import du logo
import logo from '../assets/Nditou_logo.jpg';
import Header from '../components/landing/Header';

const Register = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(''); // Ajout de l'état pour le nom d'utilisateur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const navigate = useNavigate();
  
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

  // Fonction pour valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validation du prénom
    if (!firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    }
    
    // Validation du nom
    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    }
    
    // Validation du nom d'utilisateur
    if (!username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
      isValid = false;
    }
    
    // Validation de l'email
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
      isValid = false;
    }
    
    // Validation du mot de passe
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }
    
    // Validation de la confirmation du mot de passe
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }
    
    // Validation des termes et conditions
    if (!termsAccepted) {
      newErrors.terms = 'Vous devez accepter les termes et conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setApiError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Préparation des données utilisateur
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
        role: 'patient' // Ajout du rôle par défaut
      };
      
      // Appel à l'API pour l'inscription
      await AuthService.register(userData);
      
      // Redirection vers la page de confirmation d'email avec un message de succès
      navigate('/email-confirmation', { 
        state: { email: email } 
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setApiError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
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
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>E FAJMA</h1>
          
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
        
        {/* Right side - Registration Form */}
        <div className="form-section">
          <div className="mobile-logo">
            <img src={logo} alt="Logo Fenku" style={{ height: '50px', width: 'auto' }} />
          </div>
          
          <div className="form-header">
            <h1>Inscription</h1>
            <p>Créez votre compte pour accéder à votre espace personnel E-Fajma.</p>
          </div>
          
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              {/* First Name Field */}
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Prénom</Form.Label>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                    <Form.Control 
                      type="text" 
                      placeholder="Prénom" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      isInvalid={validated && !!errors.firstName}
                      required
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              
              {/* Last Name Field */}
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Nom</Form.Label>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                    <Form.Control 
                      type="text" 
                      placeholder="Nom" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      isInvalid={validated && !!errors.lastName}
                      required
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
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
                  isInvalid={validated && !!errors.username}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Email Field */}
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <Form.Control 
                  type="email" 
                  placeholder="Adresse email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={validated && !!errors.email}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
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
                  isInvalid={validated && !!errors.password}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Confirm Password Field */}
            <Form.Group className="form-group">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <Form.Control 
                  type="password" 
                  placeholder="Confirmer le mot de passe" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={validated && !!errors.confirmPassword}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Terms and Conditions */}
            <div className="form-footer">
              <div className="terms-conditions">
                <Form.Check 
                  type="checkbox" 
                  id="terms-conditions" 
                  label="J'accepte les termes et conditions" 
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  checked={termsAccepted}
                  isInvalid={validated && !!errors.terms}
                  required
                  disabled={isLoading}
                />
                {validated && errors.terms && (
                  <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                    {errors.terms}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sign Up Button */}
            <Button className="signin-button" type="submit" disabled={isLoading || !termsAccepted}>
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
            
            {/* Sign In Link */}
            <div className="signup-link">
              Vous avez déjà un compte ? <a href="/login">Se connecter</a>
            </div>
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

=======
import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEnvelope, faIdCard } from '@fortawesome/free-solid-svg-icons';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'animate.css';
import '../styles/Login.scss';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

// Import slider images
import slider1 from '../assets/slider1.svg';
import slider2 from '../assets/slider2.svg';
import slider3 from '../assets/slider3.svg';

// Ajouter l'import du logo
import logo from '../assets/Nditou_logo.jpg';
import Header from '../components/landing/Header';

const Register = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState(''); // Ajout de l'état pour le nom d'utilisateur
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  const navigate = useNavigate();
  
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

  // Fonction pour valider le formulaire
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validation du prénom
    if (!firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
      isValid = false;
    }
    
    // Validation du nom
    if (!lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
      isValid = false;
    }
    
    // Validation du nom d'utilisateur
    if (!username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
      isValid = false;
    }
    
    // Validation de l'email
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
      isValid = false;
    }
    
    // Validation du mot de passe
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
      isValid = false;
    }
    
    // Validation de la confirmation du mot de passe
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
      isValid = false;
    }
    
    // Validation des termes et conditions
    if (!termsAccepted) {
      newErrors.terms = 'Vous devez accepter les termes et conditions';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setApiError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Préparation des données utilisateur
      const userData = {
        first_name: firstName,
        last_name: lastName,
        username: username,
        email: email,
        password: password,
        role: 'patient' // Ajout du rôle par défaut
      };
      
      // Appel à l'API pour l'inscription
      await AuthService.register(userData);
      
      // Redirection vers la page de confirmation d'email avec un message de succès
      navigate('/email-confirmation', { 
        state: { email: email } 
      });
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setApiError(error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
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
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 'bold' }}>E FAJMA</h1>
          
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
        
        {/* Right side - Registration Form */}
        <div className="form-section">
          <div className="mobile-logo">
            <img src={logo} alt="Logo Fenku" style={{ height: '50px', width: 'auto' }} />
          </div>
          
          <div className="form-header">
            <h1>Inscription</h1>
            <p>Créez votre compte pour accéder à votre espace personnel E-Fajma.</p>
          </div>
          
          {apiError && <Alert variant="danger">{apiError}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
              {/* First Name Field */}
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Prénom</Form.Label>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                    <Form.Control 
                      type="text" 
                      placeholder="Prénom" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      isInvalid={validated && !!errors.firstName}
                      required
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              
              {/* Last Name Field */}
              <Col md={6}>
                <Form.Group className="form-group">
                  <Form.Label>Nom</Form.Label>
                  <div className="input-group">
                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                    <Form.Control 
                      type="text" 
                      placeholder="Nom" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      isInvalid={validated && !!errors.lastName}
                      required
                      disabled={isLoading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
            </Row>
            
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
                  isInvalid={validated && !!errors.username}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.username}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Email Field */}
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                <Form.Control 
                  type="email" 
                  placeholder="Adresse email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  isInvalid={validated && !!errors.email}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
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
                  isInvalid={validated && !!errors.password}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Confirm Password Field */}
            <Form.Group className="form-group">
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <div className="input-group">
                <FontAwesomeIcon icon={faLock} className="input-icon" />
                <Form.Control 
                  type="password" 
                  placeholder="Confirmer le mot de passe" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  isInvalid={validated && !!errors.confirmPassword}
                  required
                  disabled={isLoading}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            
            {/* Terms and Conditions */}
            <div className="form-footer">
              <div className="terms-conditions">
                <Form.Check 
                  type="checkbox" 
                  id="terms-conditions" 
                  label="J'accepte les termes et conditions" 
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  checked={termsAccepted}
                  isInvalid={validated && !!errors.terms}
                  required
                  disabled={isLoading}
                />
                {validated && errors.terms && (
                  <div className="text-danger" style={{ fontSize: '0.875em', marginTop: '0.25rem' }}>
                    {errors.terms}
                  </div>
                )}
              </div>
            </div>
            
            {/* Sign Up Button */}
            <Button className="signin-button" type="submit" disabled={isLoading || !termsAccepted}>
              {isLoading ? 'Inscription en cours...' : 'S\'inscrire'}
            </Button>
            
            {/* Sign In Link */}
            <div className="signup-link">
              Vous avez déjà un compte ? <a href="/login">Se connecter</a>
            </div>
          </Form>
        </div>
        </div>
      </div>
    </>
  );
};

>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
export default Register;