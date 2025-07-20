import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faStethoscope, faFlask, 
  faEnvelope, faUserMd, faClock
} from '@fortawesome/free-solid-svg-icons';
import TopNavbar from '../components/Navbar';
import BiometricCard from '../components/BiometricCard';
import VitalSignsCard from '../components/VitalSignsCard';
import MedicalHistoryCard from '../components/MedicalHistoryCard';
import LifestyleCard from '../components/LifestyleCard';
import '../styles/Dashboard.scss';

const PatientDashboard = () => {
  // Données fictives pour le patient
  const patientData = {
    name: "Bess Willis",
    age: "27 ans, Californie",
    lastVisit: "15 octobre 2023",
    nextAppointment: "28 novembre 2023"
  };

  // Données fictives pour les rendez-vous
  const appointments = [
    { id: 1, doctor: "Dr. Martin", specialty: "Cardiologie", date: "28 nov 2023", time: "10:30" },
    { id: 2, doctor: "Dr. Dupont", specialty: "Dermatologie", date: "15 déc 2023", time: "14:00" }
  ];

  // Données fictives pour les consultations récentes
  const consultations = [
    { id: 1, doctor: "Dr. Bernard", specialty: "Médecine générale", date: "15 oct 2023", diagnosis: "Grippe saisonnière" },
    { id: 2, doctor: "Dr. Martin", specialty: "Cardiologie", date: "30 sept 2023", diagnosis: "Contrôle annuel" }
  ];

  // Données fictives pour les analyses biologiques
  const labResults = [
    { id: 1, type: "Analyse sanguine", date: "15 oct 2023", status: "Disponible" },
    { id: 2, type: "Cholestérol", date: "15 oct 2023", status: "Disponible" },
    { id: 3, type: "Glycémie", date: "30 sept 2023", status: "Disponible" }
  ];

  // Données fictives pour les messages
  const messages = [
    { id: 1, from: "Dr. Martin", subject: "Résultats d'analyse", date: "16 oct 2023", read: false },
    { id: 2, from: "Secrétariat Hôpital", subject: "Confirmation RDV", date: "14 oct 2023", read: true },
    { id: 3, from: "Dr. Dupont", subject: "Prescription", date: "10 oct 2023", read: true }
  ];

  // Données fictives pour les informations biométriques
  const biometricData = {
    groupeSanguin: "A+",
    poids: 68.5,
    taille: 172,
    imc: 68.5 / (1.72 * 1.72)
  };

  // Données fictives pour les signes vitaux
  const vitalSigns = {
    heart_rate: 72,
    spo2: 98,
    blood_pressure: "120/80",
    lastUpdate: "Aujourd'hui, 08:30"
  };

  // Données fictives pour les allergies
  const allergies = [
    { allergie_id: 1, substance: "Pénicilline", severite: "Sévère", date_identification: "2022-03-15" },
    { allergie_id: 2, substance: "Arachides", severite: "Modérée", date_identification: "2021-07-22" }
  ];

  // Données fictives pour les antécédents
  const antecedents = [
    { Antecedent_id: 1, type: { nom: "Chirurgical" }, Description: "Appendicectomie en 2018" },
    { Antecedent_id: 2, type: { nom: "Familial" }, Description: "Diabète de type 2 (père)" }
  ];

  // Données fictives pour les habitudes de vie
  const habitudesVie = {
    tabagisme: "Non-fumeur",
    alcool: "Occasionnel",
    activite_physique: "Modérée, 3 fois par semaine",
    alimentation: "Équilibrée, régime méditerranéen"
  };

  return (
    <div className="dashboard-layout-new">
      {/* Barre de navigation en haut */}
      <TopNavbar />

      {/* Contenu principal */}
      <div className="main-content-new">
        <div className="dashboard-container">
          <Container fluid>
            <Row className="mb-4">
              <Col md={3}>
                {/* Profil du patient */}
                <Card className="profile-card">
                  <Card.Body className="text-center">
                    <div className="avatar-container mb-3">
                      <img 
                        src="/path/to/avatar.png" 
                        alt="Avatar du Patient" 
                        className="avatar-image" 
                      />
                    </div>
                    <h3>{patientData.name}</h3>
                    <p className="text-muted">{patientData.age}</p>
                    
                    <div className="patient-stats d-flex justify-content-between mt-4">
                      <div className="stat-item">
                        <h6>Dernière visite</h6>
                        <p>{patientData.lastVisit}</p>
                      </div>
                      <div className="stat-item">
                        <h6>Prochain RDV</h6>
                        <p>{patientData.nextAppointment}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={9}>
                {/* Carte des signes vitaux */}
                <VitalSignsCard vitalSigns={vitalSigns} />
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={6}>
                {/* Carte des données biométriques */}
                <BiometricCard biometricData={biometricData} />
              </Col>
              <Col md={6}>
                {/* Carte des habitudes de vie */}
                <LifestyleCard habitudesVie={habitudesVie} />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                {/* Carte des antécédents et allergies */}
                <MedicalHistoryCard allergies={allergies} antecedents={antecedents} />
              </Col>
            </Row>
            
            <Row className="mb-4">
              <Col md={12}>
                {/* Carte des rendez-vous */}
                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faCalendarCheck} className="me-2 text-primary" /> 
                      Prochains rendez-vous
                    </h5>
                    <Badge bg="primary" pill>{appointments.length}</Badge>
                  </Card.Header>
                  <Card.Body>
                    {appointments.map(appointment => (
                      <div key={appointment.id} className="appointment-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                        <div className="d-flex align-items-center">
                          <div className="appointment-icon me-3">
                            <FontAwesomeIcon icon={faUserMd} />
                          </div>
                          <div>
                            <h6 className="mb-0">{appointment.doctor}</h6>
                            <p className="text-muted mb-0">{appointment.specialty}</p>
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faCalendarCheck} className="me-2 text-primary" />
                            <span>{appointment.date}</span>
                          </div>
                          <div className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faClock} className="me-2 text-secondary" />
                            <span>{appointment.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                {/* Carte des consultations récentes */}
                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faStethoscope} className="me-2 text-success" /> 
                      Consultations récentes
                    </h5>
                    <Badge bg="success" pill>{consultations.length}</Badge>
                  </Card.Header>
                  <Card.Body>
                    {consultations.map(consultation => (
                      <div key={consultation.id} className="consultation-item mb-3 pb-3 border-bottom">
                        <div className="d-flex justify-content-between">
                          <h6>{consultation.doctor}</h6>
                          <span className="text-muted">{consultation.date}</span>
                        </div>
                        <p className="text-muted mb-1">{consultation.specialty}</p>
                        <p className="mb-0"><strong>Diagnostic:</strong> {consultation.diagnosis}</p>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                {/* Carte des analyses biologiques */}
                <Card className="mb-4">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faFlask} className="me-2 text-info" /> 
                      Analyses biologiques
                    </h5>
                    <Badge bg="info" pill>{labResults.length}</Badge>
                  </Card.Header>
                  <Card.Body>
                    {labResults.map(result => (
                      <div key={result.id} className="lab-result-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                        <div>
                          <h6 className="mb-0">{result.type}</h6>
                          <p className="text-muted mb-0">{result.date}</p>
                        </div>
                        <Badge bg={result.status === "Disponible" ? "success" : "warning"}>
                          {result.status}
                        </Badge>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={4}>
                {/* Carte des messages */}
                <Card>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2 text-warning" /> 
                      Messages
                    </h5>
                    <Badge bg="warning" pill>{messages.length}</Badge>
                  </Card.Header>
                  <Card.Body>
                    {messages.map(message => (
                      <div key={message.id} className="message-item d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom">
                        <div>
                          <h6 className="mb-0">
                            {!message.read && <span className="dot-unread me-2"></span>}
                            {message.subject}
                          </h6>
                          <p className="text-muted mb-0">De: {message.from}</p>
                        </div>
                        <span className="text-muted">{message.date}</span>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;