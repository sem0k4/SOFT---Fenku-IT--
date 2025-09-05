import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAllergies, faHistory } from '@fortawesome/free-solid-svg-icons';

const MedicalHistoryCard = ({ allergies, antecedents }) => {
  // Fonction pour déterminer la couleur du badge selon la sévérité
  const getAllergyBadgeVariant = (severity) => {
    const severityLower = severity.toLowerCase();
    if (severityLower === 'sévère' || severityLower === 'critique') return 'danger';
    if (severityLower === 'modérée') return 'warning';
    return 'info';
  };

  return (
    <Card className="mb-4 health-card">
      <Card.Header>
        <h5 className="mb-0">
          <FontAwesomeIcon icon={faHistory} className="me-2 text-warning" /> 
          Antécédents & Allergies
        </h5>
      </Card.Header>
      <Card.Body>
        <h6 className="mb-3">
          <FontAwesomeIcon icon={faAllergies} className="me-2 text-danger" />
          Allergies
        </h6>
        {allergies && allergies.length > 0 ? (
          <ListGroup variant="flush" className="mb-4">
            {allergies.map((allergie) => (
              <ListGroup.Item key={allergie.allergie_id} className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{allergie.substance}</strong>
                  <div className="text-muted small">Identifiée le {new Date(allergie.date_identification).toLocaleDateString()}</div>
                </div>
                <Badge bg={getAllergyBadgeVariant(allergie.severite)}>
                  {allergie.severite}
                </Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted">Aucune allergie connue</p>
        )}

        <h6 className="mb-3 mt-4">
          <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" />
          Antécédents médicaux
        </h6>
        {antecedents && antecedents.length > 0 ? (
          <ListGroup variant="flush">
            {antecedents.map((antecedent) => (
              <ListGroup.Item key={antecedent.Antecedent_id}>
                <div className="d-flex justify-content-between">
                  <strong>{antecedent.type.nom}</strong>
                </div>
                <p className="mb-0 mt-1">{antecedent.Description}</p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted">Aucun antécédent médical enregistré</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default MedicalHistoryCard;