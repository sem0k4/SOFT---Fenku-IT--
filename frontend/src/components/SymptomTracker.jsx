import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Calendar,
  Clock,
  Bell,
  TrendingUp,
  Activity,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { consultationService } from '../services/medicalApi';

/**
 * Composant de suivi des symptômes et rappels de traitement
 * Technologies: React, Material-UI, Axios
 * Permet le suivi des symptômes et la gestion des rappels de traitement
 */
const SymptomTracker = ({ patientId, onClose }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [symptoms, setSymptoms] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [showAddSymptom, setShowAddSymptom] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // État pour le nouveau symptôme FENKU-IT
  const [newSymptom, setNewSymptom] = useState({
    name: '',
    severity: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  // État pour le nouveau rappel FENKU-IT
  const [newReminder, setNewReminder] = useState({
    medication: '',
    time: '',
    frequency: 'daily',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    notes: ''
  });

  // Chargement des données au montage FENKU-IT
  useEffect(() => {
    loadSymptomHistory();
    loadReminders();
  }, [patientId]);

  // Chargement de l'historique des symptômes FENKU-IT
  const loadSymptomHistory = async () => {
    setIsLoading(true);
    try {
      const history = await consultationService.getConsultationHistory(patientId);
      setSymptoms(history.filter(h => h.type === 'symptom_follow_up'));
    } catch (error) {
      console.error('Erreur chargement historique symptômes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement des rappels FENKU-IT
  const loadReminders = async () => {
    try {
      // Simulation de rappels - remplacer par l'API réelle FENKU-IT
      const mockReminders = [
        {
          id: 1,
          medication: 'Metformine',
          time: '08:00',
          frequency: 'daily',
          isActive: true,
          nextReminder: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          medication: 'Lisinopril',
          time: '20:00',
          frequency: 'daily',
          isActive: true,
          nextReminder: new Date(Date.now() + 12 * 60 * 60 * 1000)
        }
      ];
      setReminders(mockReminders);
    } catch (error) {
      console.error('Erreur chargement rappels:', error);
    }
  };

  // Styles cohérents FENKU-IT
  const getCardStyles = () => ({
    background: theme.palette.mode === 'dark' 
      ? colors.blackAccent[600]
      : '#fcfcfc',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    boxShadow: theme.palette.mode === 'dark' 
      ? '0 20px 40px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)',
  });

  // Ajout d'un nouveau symptôme FENKU-IT
  const handleAddSymptom = async () => {
    if (!newSymptom.name || !newSymptom.severity) return;

    setIsLoading(true);
    try {
      await consultationService.recordSymptomFollowUp(patientId, {
        symptoms: [newSymptom.name],
        severity: newSymptom.severity,
        notes: newSymptom.description
      });

      // Mise à jour locale FENKU-IT
      setSymptoms(prev => [...prev, {
        id: Date.now(),
        ...newSymptom,
        timestamp: new Date().toISOString()
      }]);

      setNewSymptom({
        name: '',
        severity: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddSymptom(false);
    } catch (error) {
      console.error('Erreur ajout symptôme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajout d'un nouveau rappel FENKU-IT
  const handleAddReminder = async () => {
    if (!newReminder.medication || !newReminder.time) return;

    try {
      await consultationService.scheduleReminder(patientId, {
        medication: newReminder.medication,
        time: newReminder.time,
        frequency: newReminder.frequency,
        startDate: newReminder.startDate,
        endDate: newReminder.endDate,
        notes: newReminder.notes
      });

      // Mise à jour locale FENKU-IT
      setReminders(prev => [...prev, {
        id: Date.now(),
        ...newReminder,
        isActive: true,
        nextReminder: new Date()
      }]);

      setNewReminder({
        medication: '',
        time: '',
        frequency: 'daily',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        notes: ''
      });
      setShowAddReminder(false);
    } catch (error) {
      console.error('Erreur ajout rappel:', error);
    }
  };

  // Suppression d'un rappel FENKU-IT
  const handleDeleteReminder = (reminderId) => {
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  // Formatage de la date FENKU-IT
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcul du prochain rappel FENKU-IT
  const getNextReminderTime = (reminder) => {
    const now = new Date();
    const next = new Date(reminder.nextReminder);
    const diff = next.getTime() - now.getTime();
    
    if (diff <= 0) return 'Maintenant';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `Dans ${hours}h ${minutes}min`;
    } else {
      return `Dans ${minutes}min`;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000
      }}
    >
      <Box
        sx={{
          width: { xs: '95%', sm: 700 },
          maxHeight: '90vh',
          overflow: 'auto',
          ...getCardStyles()
        }}
      >
        {/* Header FENKU-IT */}
        <Box
          sx={{
            p: 2,
            background: '#0096b0',
            borderRadius: '16px 16px 0 0',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            📊 Suivi des Symptômes & Rappels
          </Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Section Rappels FENKU-IT */}
          <Card sx={{ mb: 3, ...getCardStyles() }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Bell size={20} color="#0096b0" />
                  Rappels de Traitement
                </Typography>
                <Button
                  startIcon={<Plus size={16} />}
                  onClick={() => setShowAddReminder(true)}
                  size="small"
                  sx={{ color: '#0096b0' }}
                >
                  Ajouter
                </Button>
              </Box>

              {reminders.length === 0 ? (
                <Alert severity="info">
                  Aucun rappel programmé. Ajoutez vos médicaments pour recevoir des rappels.
                </Alert>
              ) : (
                <List>
                  {reminders.map((reminder) => (
                    <ListItem key={reminder.id} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Clock size={20} color="#0096b0" />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${reminder.medication} - ${reminder.time}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Fréquence: {reminder.frequency === 'daily' ? 'Quotidien' : 'Hebdomadaire'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Prochain: {getNextReminderTime(reminder)}
                            </Typography>
                          </Box>
                        }
                      />
                      <IconButton
                        onClick={() => handleDeleteReminder(reminder.id)}
                        size="small"
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          {/* Section Suivi des Symptômes FENKU-IT */}
          <Card sx={{ ...getCardStyles() }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Activity size={20} color="#0096b0" />
                  Suivi des Symptômes
                </Typography>
                <Button
                  startIcon={<Plus size={16} />}
                  onClick={() => setShowAddSymptom(true)}
                  size="small"
                  sx={{ color: '#0096b0' }}
                >
                  Ajouter
                </Button>
              </Box>

              {symptoms.length === 0 ? (
                <Alert severity="info">
                  Aucun symptôme enregistré. Ajoutez vos symptômes pour suivre leur évolution.
                </Alert>
              ) : (
                <List>
                  {symptoms.map((symptom, index) => (
                    <React.Fragment key={symptom.id || index}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <TrendingUp size={20} color="#0096b0" />
                        </ListItemIcon>
                        <ListItemText
                          primary={symptom.name || symptom.symptoms?.[0]}
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                Sévérité: {symptom.severity}/10
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Date: {formatDate(symptom.timestamp || symptom.date)}
                              </Typography>
                              {symptom.description && (
                                <Typography variant="body2" color="text.secondary">
                                  {symptom.description}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <Chip
                          label={symptom.severity >= 7 ? 'Élevé' : symptom.severity >= 4 ? 'Modéré' : 'Faible'}
                          color={symptom.severity >= 7 ? 'error' : symptom.severity >= 4 ? 'warning' : 'success'}
                          size="small"
                        />
                      </ListItem>
                      {index < symptoms.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Dialog Ajout Symptôme FENKU-IT */}
        <Dialog open={showAddSymptom} onClose={() => setShowAddSymptom(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter un Symptôme</DialogTitle>
          <DialogContent>
            <TextField
              label="Nom du symptôme"
              value={newSymptom.name}
              onChange={(e) => setNewSymptom(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
              sx={{ mb: 2, mt: 1 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sévérité (0-10)</InputLabel>
              <Select
                value={newSymptom.severity}
                onChange={(e) => setNewSymptom(prev => ({ ...prev, severity: e.target.value }))}
                label="Sévérité (0-10)"
              >
                {[0,1,2,3,4,5,6,7,8,9,10].map(value => (
                  <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Description (optionnel)"
              multiline
              rows={3}
              value={newSymptom.description}
              onChange={(e) => setNewSymptom(prev => ({ ...prev, description: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddSymptom(false)}>Annuler</Button>
            <Button onClick={handleAddSymptom} variant="contained" disabled={isLoading}>
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog Ajout Rappel FENKU-IT */}
        <Dialog open={showAddReminder} onClose={() => setShowAddReminder(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Ajouter un Rappel</DialogTitle>
          <DialogContent>
            <TextField
              label="Médicament"
              value={newReminder.medication}
              onChange={(e) => setNewReminder(prev => ({ ...prev, medication: e.target.value }))}
              fullWidth
              sx={{ mb: 2, mt: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Heure"
                type="time"
                value={newReminder.time}
                onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                sx={{ flex: 1 }}
              />
              <FormControl sx={{ flex: 1 }}>
                <InputLabel>Fréquence</InputLabel>
                <Select
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, frequency: e.target.value }))}
                  label="Fréquence"
                >
                  <MenuItem value="daily">Quotidien</MenuItem>
                  <MenuItem value="weekly">Hebdomadaire</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <TextField
              label="Notes (optionnel)"
              multiline
              rows={2}
              value={newReminder.notes}
              onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowAddReminder(false)}>Annuler</Button>
            <Button onClick={handleAddReminder} variant="contained">
              Ajouter
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default SymptomTracker;
