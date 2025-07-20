import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSmoking, faWineGlass, faRunning, faAppleAlt } from '@fortawesome/free-solid-svg-icons';

const LifestyleCard = ({ habitudesVie }) => {
  return (
    <Card className="mb-4 health-card">
      <Card.Header>
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faRunning} className="me-2 text-success" /> 
          Habitudes de Vie
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6} className="mb-3">
            <div className="lifestyle-item">
              <FontAwesomeIcon icon={faSmoking} size="lg" className="me-2 text-secondary" />
              <div>
                <h6>Tabagisme</h6>
                <p className="mb-0">{habitudesVie.tabagisme || 'Non renseigné'}</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div className="lifestyle-item">
              <FontAwesomeIcon icon={faWineGlass} size="lg" className="me-2 text-danger" />
              <div>
                <h6>Consommation d'alcool</h6>
                <p className="mb-0">{habitudesVie.alcool || 'Non renseigné'}</p>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={6} className="mb-3">
            <div className="lifestyle-item">
              <FontAwesomeIcon icon={faRunning} size="lg" className="me-2 text-success" />
              <div>
                <h6>Activité physique</h6>
                <p className="mb-0">{habitudesVie.activite_physique || 'Non renseigné'}</p>
              </div>
            </div>
          </Col>
          <Col md={6} className="mb-3">
            <div className="lifestyle-item">
              <FontAwesomeIcon icon={faAppleAlt} size="lg" className="me-2 text-warning" />
              <div>
                <h6>Alimentation</h6>
                <p className="mb-0">{habitudesVie.alimentation || 'Non renseigné'}</p>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default LifestyleCard;