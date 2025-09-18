import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWeight, faRulerVertical, faDroplet } from '@fortawesome/free-solid-svg-icons';

const BiometricCard = ({ biometricData }) => {
  return (
    <Card className="mb-4 health-card">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faDroplet} className="me-2 text-danger" /> 
          Données Biométriques
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={4} className="text-center mb-3">
            <div className="biometric-item">
              <FontAwesomeIcon icon={faDroplet} size="2x" className="text-danger mb-2" />
              <h6>Groupe Sanguin</h6>
              <h4>{biometricData.groupeSanguin || 'Non renseigné'}</h4>
            </div>
          </Col>
          <Col md={4} className="text-center mb-3">
            <div className="biometric-item">
              <FontAwesomeIcon icon={faWeight} size="2x" className="text-primary mb-2" />
              <h6>Poids</h6>
              <h4>{biometricData.poids ? `${biometricData.poids} kg` : 'Non renseigné'}</h4>
            </div>
          </Col>
          <Col md={4} className="text-center mb-3">
            <div className="biometric-item">
              <FontAwesomeIcon icon={faRulerVertical} size="2x" className="text-success mb-2" />
              <h6>Taille</h6>
              <h4>{biometricData.taille ? `${biometricData.taille} cm` : 'Non renseigné'}</h4>
            </div>
          </Col>
        </Row>
        {biometricData.imc && (
          <div className="text-center mt-2 pt-2 border-top">
            <h6>IMC</h6>
            <h4>{biometricData.imc.toFixed(1)}</h4>
            <p className="text-muted">{getImcCategory(biometricData.imc)}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

// Fonction pour déterminer la catégorie d'IMC
const getImcCategory = (imc) => {
  if (imc < 18.5) return 'Insuffisance pondérale';
  if (imc < 25) return 'Corpulence normale';
  if (imc < 30) return 'Surpoids';
  if (imc < 35) return 'Obésité modérée';
  if (imc < 40) return 'Obésité sévère';
  return 'Obésité morbide';
};

export default BiometricCard;
