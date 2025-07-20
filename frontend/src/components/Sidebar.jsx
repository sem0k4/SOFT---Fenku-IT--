<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faCalendarAlt, faStethoscope, 
  faFileMedical, faEnvelope, faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>E-FAJMA</h2>
      </div>
      
      <div className="sidebar-category">MENU PRINCIPAL</div>
      <Nav className="flex-column">
        <Nav.Link className="sidebar-link active" href="/patient-dashboard">
          <FontAwesomeIcon icon={faHome} /> Accueil
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/rendez-vous">
          <FontAwesomeIcon icon={faCalendarAlt} /> Rendez-vous
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/consultations">
          <FontAwesomeIcon icon={faStethoscope} /> Consultations
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/documents">
          <FontAwesomeIcon icon={faFileMedical} /> Documents
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/messages">
          <FontAwesomeIcon icon={faEnvelope} /> Messages
        </Nav.Link>
      </Nav>
      
      <div className="sidebar-footer">
        <Button variant="outline-danger" onClick={handleLogout} className="logout-btn">
          <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
        </Button>
      </div>
    </div>
  );
};

<<<<<<< HEAD
=======
import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faCalendarAlt, faStethoscope, 
  faFileMedical, faEnvelope, faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>E-FAJMA</h2>
      </div>
      
      <div className="sidebar-category">MENU PRINCIPAL</div>
      <Nav className="flex-column">
        <Nav.Link className="sidebar-link active" href="/patient-dashboard">
          <FontAwesomeIcon icon={faHome} /> Accueil
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/rendez-vous">
          <FontAwesomeIcon icon={faCalendarAlt} /> Rendez-vous
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/consultations">
          <FontAwesomeIcon icon={faStethoscope} /> Consultations
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/documents">
          <FontAwesomeIcon icon={faFileMedical} /> Documents
        </Nav.Link>
        <Nav.Link className="sidebar-link" href="/messages">
          <FontAwesomeIcon icon={faEnvelope} /> Messages
        </Nav.Link>
      </Nav>
      
      <div className="sidebar-footer">
        <Button variant="outline-danger" onClick={handleLogout} className="logout-btn">
          <FontAwesomeIcon icon={faSignOutAlt} /> Déconnexion
        </Button>
      </div>
    </div>
  );
};

>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
export default Sidebar;