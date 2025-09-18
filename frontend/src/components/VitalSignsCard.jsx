import React from 'react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faLungs, faTint } from '@fortawesome/free-solid-svg-icons';

const VitalSignsCard = ({ vitalSigns }) => {
  // Fonction pour déterminer la couleur de la barre de progression
  const getHeartRateVariant = (rate) => {
    if (rate < 60) return 'info';
    if (rate > 100) return 'danger';
    return 'success';
  };

  const getSpo2Variant = (spo2) => {
    if (spo2 < 90) return 'danger';
    if (spo2 < 95) return 'warning';
    return 'success';
  };

  // Extraction des valeurs de pression artérielle
  const extractBloodPressure = (bp) => {
    if (!bp) return { systolic: null, diastolic: null };
    const parts = bp.split('/');
    return {
      systolic: parts[0] ? parseInt(parts[0]) : null,
      diastolic: parts[1] ? parseInt(parts[1]) : null
    };
  };

  const bloodPressure = extractBloodPressure(vitalSigns.blood_pressure);

  return (
    <Card className="mb-4 health-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faHeartbeat} className="me-2 text-danger" /> 
          Signes Vitaux
        </h5>
        <span className="text-muted small">Dernière mise à jour: {vitalSigns.lastUpdate || 'Inconnue'}</span>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4} className="mb-3">
            <div className="vital-sign-item">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6><FontAwesomeIcon icon={faHeartbeat} className="me-2 text-danger" /> Fréquence cardiaque</h6>
                <span className="badge bg-light text-dark">{vitalSigns.heart_rate || '--'} bpm</span>
              </div>
              {vitalSigns.heart_rate && (
                <ProgressBar 
                  now={Math.min(vitalSigns.heart_rate, 180)} 
                  max={180} 
                  variant={getHeartRateVariant(vitalSigns.heart_rate)} 
                />
              )}
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="vital-sign-item">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6><FontAwesomeIcon icon={faLungs} className="me-2 text-info" /> SpO2</h6>
                <span className="badge bg-light text-dark">{vitalSigns.spo2 || '--'}%</span>
              </div>
              {vitalSigns.spo2 && (
                <ProgressBar 
                  now={vitalSigns.spo2} 
                  max={100} 
                  variant={getSpo2Variant(vitalSigns.spo2)} 
                />
              )}
            </div>
          </Col>
          <Col md={4} className="mb-3">
            <div className="vital-sign-item">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <h6><FontAwesomeIcon icon={faTint} className="me-2 text-primary" /> Pression artérielle</h6>
                <span className="badge bg-light text-dark">{vitalSigns.blood_pressure || '--'}</span>
              </div>
              {bloodPressure.systolic && bloodPressure.diastolic && (
                <div className="d-flex justify-content-between small text-muted">
                  <span>Systolique: {bloodPressure.systolic} mmHg</span>
                  <span>Diastolique: {bloodPressure.diastolic} mmHg</span>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VitalSignsCard;
