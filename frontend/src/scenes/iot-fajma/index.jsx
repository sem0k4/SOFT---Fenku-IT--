
import { useState, useEffect } from "react";
import { Box, Typography, useTheme, CircularProgress, Alert, Button, Grid, Card, CardContent } from "@mui/material";
import HeaderDashboard from "../../components/shared/HeaderDashboard";
import { tokens } from "../../theme";
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import WifiIcon from '@mui/icons-material/Wifi';
import SensorsIcon from '@mui/icons-material/Sensors';
import RefreshIcon from '@mui/icons-material/Refresh';
import useMQTTDirect from "../../hooks/useMQTTDirect";
import AuthService from "../../services/auth";

const IotFAJMA = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // Utiliser le hook MQTT direct pour les données MLX90614
    const {
        isConnected,
        isConnecting,
        error,
        temperatureData,
        deviceStatus,
        formattedData,
        connect,
        disconnect,
        sendCommand,
        clearError
    } = useMQTTDirect();

    // État pour stocker les informations du patient
    const [patientInfo, setPatientInfo] = useState({
        salutation: "IoT FAJMA",
        nom: "Données Vitales en Temps Réel"
    });

    // Configuration des cartes de données MQTT
    const temperatureCards = [
        {
            id: 1,
            title: "Température Corporelle",
            value: formattedData.object_temperature,
            unit: "°C",
            subtitle: "Données reçues du topic emqx/esp32",
            icon: DeviceThermostatOutlinedIcon,
            color: colors.secondary[500],
            normalRange: "36.0 - 37.5°C",
            isRealTime: isConnected,
            rawData: formattedData.raw_data
        },
        {
            id: 2,
            title: "Fréquence Cardiaque",
            value: formattedData.heart_rate || "--",
            unit: "bpm",
            subtitle: "Rythme cardiaque en temps réel",
            icon: FavoriteOutlinedIcon,
            color: colors.secondary[500],
            normalRange: "60 - 100 bpm",
            isRealTime: isConnected,
            rawData: formattedData.raw_data
        },
        {
            id: 3,
            title: "Saturation O₂ (SpO₂)",
            value: formattedData.spo2 || "--",
            unit: "%",
            subtitle: "Concentration d'oxygène dans le sang",
            icon: WaterDropOutlinedIcon,
            color: colors.secondary[500],
            normalRange: "95 - 100%",
            isRealTime: isConnected,
            rawData: formattedData.raw_data
        }
    ];

    // Récupérer les informations du patient connecté au chargement du composant
    useEffect(() => {
        const userInfo = AuthService.getUserInfo();
        if (userInfo) {
            setPatientInfo({
                salutation: "IoT FAJMA",
                nom: `Surveillance E-santé - ${userInfo.prenom || 'Patient'}`
            });
        }
    }, []);

    // Fonction pour reconnecter manuellement
    const handleReconnect = () => {
        if (!isConnecting) {
            connect();
        }
    };

    // Fonction pour demander une lecture immédiate
    const handleReadTemperature = () => {
        sendCommand('read_temperature');
    };

    // Composant de carte de température personnalisé
    const TemperatureCard = ({ card }) => (
        <Card sx={{ 
            backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#ffffff',
            borderRadius: '12px',
            boxShadow: 3,
            height: '250px',
            width: '100%',
            position: 'relative',
            overflow: 'visible'
        }}>
            <Box sx={{
                position: 'absolute',
                top: '-20px',
                left: '20px',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: card.id === 1 ? '#0097a7' : card.id === 2 ? '#f44336' : '#2196f3',
                boxShadow: 2
            }}>
                <card.icon sx={{ fontSize: 30, color: '#ffffff' }} />
            </Box>
            <Box sx={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : '#f5f5f5',
                color: theme.palette.mode === 'dark' ? '#ffffff' : '#333333',
                borderRadius: '15px',
                padding: '4px 10px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
            }}>
                FAJMA +
                <Box sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: card.isRealTime ? '#4caf50' : '#9e9e9e'
                }} />
            </Box>
            <CardContent sx={{ p: 3, pt: 5, mt: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'auto' }}>
                <Box sx={{ flex: '0 0 auto' }}>
                    <Box sx={{ textAlign: 'center', mb: 2, mt: 1 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : colors.grey[800], fontWeight: 'bold' }}>
                            {card.title}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 1 }}>
                        <Typography variant="h3" sx={{ color: card.id === 1 ? '#0097a7' : card.id === 2 ? '#f44336' : '#2196f3', fontWeight: 'bold', mr: 1 }}>
                            {card.value}
                        </Typography>
                        <Typography variant="h6" sx={{ color: card.id === 1 ? '#0097a7' : card.id === 2 ? '#f44336' : '#2196f3' }}>
                            {card.unit}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flex: '0 0 auto', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? '#ffffff' : colors.grey[600] }}>
                        {card.subtitle}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : colors.grey[500], mt: 1 }}>
                        Plage normale: {card.normalRange}
                    </Typography>
                </Box>
                {card.rawData && (
                    <Box sx={{ 
                        mt: 2, 
                        p: 1, 
                        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.03)', 
                        borderRadius: 1,
                        display: 'none' // Caché selon le design des images
                    }}>
                        <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.grey[300] : colors.grey[700], fontWeight: 'bold' }}>
                            Device ID:
                        </Typography>
                        <Typography variant="body2" sx={{ color: theme.palette.mode === 'dark' ? colors.grey[400] : colors.grey[800], fontFamily: 'monospace', wordBreak: 'break-all' }}>
                            {(() => {
                                try {
                                    const data = JSON.parse(card.rawData);
                                    return data.device_id || 'esp32-78:42:1C:67:63:A8';
                                } catch {
                                    return 'esp32-78:42:1C:67:63:A8';
                                }
                            })()}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    // Afficher un indicateur de chargement initial
    if (isConnecting && !isConnected && !temperatureData.ambient_temperature) {
        return (
            <Box>
                <HeaderDashboard
                    title={patientInfo.salutation}
                    span={patientInfo.nom}
                    subtitle="Connexion au broker MQTT ..."
                />
                <Box className="flex justify-center items-center" sx={{ height: '400px' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ ml: 2, color: colors.grey[100] }}>
                        Établissement de la connexion MQTT...
                    </Typography>
                </Box>
            </Box>
        );
    }

    return (
        <Box>
            <HeaderDashboard
                title={patientInfo.salutation}
                span={patientInfo.nom}
                subtitle="Surveillance de température en temps réel via MQTT"
            />
            
            {/* Statut de connexion */}
            <Card sx={{ 
                backgroundColor: colors.primary[400], 
                mb: 3, 
                borderRadius: '12px',
                border: `1px solid ${isConnected ? colors.greenAccent[500] : colors.redAccent[500]}`
            }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <WifiIcon sx={{ 
                                color: isConnected ? colors.greenAccent[500] : colors.redAccent[500], 
                                mr: 2, 
                                fontSize: 30 
                            }} />
                            <Box>
                                <Typography variant="h6" sx={{ color: colors.grey[100] }}>
                                    Statut MQTT: {isConnected ? 'Connecté' : isConnecting ? 'Connexion...' : 'Déconnecté'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: colors.grey[200] }}>
                                    Capteur: {deviceStatus.sensor_connected ? 'Actif' : 'Inactif'} | 
                                    Signal WiFi: {formattedData.wifi_signal} | 
                                    Dernière mise à jour: {formattedData.last_update}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<SensorsIcon />}
                                onClick={handleReadTemperature}
                                disabled={!isConnected}
                                size="small"
                                sx={{
                                    borderColor: colors.secondary[500],
                                    color: colors.secondary[500],
                                    '&:hover': {
                                        borderColor: colors.secondary[400],
                                        backgroundColor: colors.secondary[900],
                                    },
                                }}
                            >
                                Lire
                            </Button>
                            {!isConnected && (
                                <Button
                                    variant="contained"
                                    startIcon={<RefreshIcon />}
                                    onClick={handleReconnect}
                                    disabled={isConnecting}
                                    size="small"
                                    sx={{
                                        backgroundColor: colors.secondary[600],
                                        '&:hover': {
                                            backgroundColor: colors.secondary[700],
                                        },
                                    }}
                                >
                                    {isConnecting ? 'Connexion...' : 'Reconnecter'}
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Affichage des erreurs */}
            {error && (
                <Alert 
                    severity="error" 
                    onClose={clearError}
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* Cartes des données de température */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {temperatureCards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.id}>
                        <TemperatureCard card={card} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default IotFAJMA;