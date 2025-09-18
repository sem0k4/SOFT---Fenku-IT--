import React, { useState } from 'react';
import { Navbar, Container, Nav, NavDropdown, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, faEnvelope, faUser, 
  faCog, faQuestionCircle, faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/auth';

const TopNavbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar className="top-navbar" expand="lg" fixed="top">
      <Container fluid>
        <Navbar.Brand href="/patient-dashboard" className="navbar-brand">E-FAJMA</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="main-nav">
            <Nav.Link href="/patient-dashboard" className="active">Accueil</Nav.Link>
            <Nav.Link href="/rendez-vous">Rendez-vous</Nav.Link>
            <Nav.Link href="/consultations">Consultations</Nav.Link>
            <Nav.Link href="/documents">Documents</Nav.Link>
            <Nav.Link href="/messages">Messages</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link className="nav-icon">
              <FontAwesomeIcon icon={faBell} />
              <span className="notification-badge">3</span>
            </Nav.Link>
            <Nav.Link className="nav-icon">
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="notification-badge">2</span>
            </Nav.Link>
            <NavDropdown 
              title={
                <div className="nav-user-dropdown">
                  <div className="avatar-mini">
                    <FontAwesomeIcon icon={faUser} size="lg" />
                  </div>
                </div>
              } 
              id="basic-nav-dropdown"
              align="end"
              show={showDropdown}
              onToggle={(isOpen) => setShowDropdown(isOpen)}
              className={showDropdown ? "nav-item show" : "nav-item"}
            >
              <NavDropdown.Item href="/profile">
                <FontAwesomeIcon icon={faUser} className="me-2" /> Profil
              </NavDropdown.Item>
              <NavDropdown.Item href="/settings">
                <FontAwesomeIcon icon={faCog} className="me-2" /> Paramètres
              </NavDropdown.Item>
              <NavDropdown.Item href="/help">
                <FontAwesomeIcon icon={faQuestionCircle} className="me-2" /> Aide
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Déconnexion
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
