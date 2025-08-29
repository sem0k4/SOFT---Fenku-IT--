
<<<<<<< HEAD
const IotFAJMA = () => {
    return (
        <div>
            <h1>IoT FAJMA</h1>
        </div>
    )
}
=======
import { useState, useEffect } from "react";
import { Box, Typography, useTheme, CircularProgress, Alert, Button, Grid } from "@mui/material";
import HeaderDashboard from "../../components/shared/HeaderDashboard";
import { IoTConnectionStatus, IoTDataCard } from "../../components";
import { tokens } from "../../theme";
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import OpacityOutlinedIcon from '@mui/icons-material/OpacityOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useIoTWebSocket } from "../../hooks";
import AuthService from "../../services/auth";

const IotFAJMA = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // Utiliser le hook WebSocket pour les données IoT en temps réel
    const {
        iotData,
        devices,
        alerts,
        connectionStatus,
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        acknowledgeAlert,
        clearError,
        formattedData
    } = useIoTWebSocket();

    // État pour stocker les informations du patient
    const [patientInfo, setPatientInfo] = useState({
        salutation: "IoT FAJMA",
        nom: "Données Vitales en Temps Réel"
    });

    // Configuration des cartes IoT avec données en temps réel
    const iotCards = [
        {
            id: 1,
            title: "SPO2",
            value: formattedData.spo2,
            subtitle: "Saturation en oxygène",
            unit: "%",
            icon: OpacityOutlinedIcon,
            color: colors.primary[500],
            normalRange: "95-100%",
            minValue: 80,
            maxValue: 100,
            isRealTime: isConnected
        },
        {
            id: 2,
            title: "Température corporelle",
            value: formattedData.temperature,
            subtitle: "Température du corps",
            unit: "°C",
            icon: DeviceThermostatOutlinedIcon,
            color: colors.secondary[500],
            normalRange: "36.1-37.2°C",
            minValue: 35,
            maxValue: 40,
            isRealTime: isConnected
        },
        {
            id: 3,
            title: "Fréquence cardiaque",
            value: formattedData.heart_rate,
            subtitle: "Battements par minute",
            unit: "bpm",
            icon: FavoriteBorderOutlinedIcon,
            color: colors.redAccent[500],
            normalRange: "60-100 bpm",
            minValue: 40,
            maxValue: 120,
            isRealTime: isConnected
        }
    ];

    // Récupérer les informations du patient connecté au chargement du composant
    useEffect(() => {
        const userInfo = AuthService.getUserInfo();
        if (userInfo) {
            setPatientInfo({
                salutation: "IoT FAJMA",
                nom: `Données de ${userInfo.prenom || 'Patient'} - Temps Réel`
            });
        }
    }, []);

    // Fonction pour reconnecter manuellement
    const handleReconnect = () => {
        if (!isConnecting) {
            connect();
        }
    };

    // Afficher un indicateur de chargement initial
    if (isConnecting && !isConnected && !iotData.spo2 && !iotData.temperature && !iotData.heart_rate) {
        return (
            <Box>
                <HeaderDashboard
                    title={patientInfo.salutation}
                    span={patientInfo.nom}
                    subtitle="Connexion au serveur IoT..."
                />
                <Box className="flex justify-center items-center" sx={{ height: '400px' }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ ml: 2, color: colors.grey[100] }}>
                        Établissement de la connexion WebSocket...
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
                subtitle="Surveillance des données vitales en temps réel"
            />
            
            {/* Statut de connexion et alertes */}
            <IoTConnectionStatus 
                isConnected={isConnected}
                isConnecting={isConnecting}
                error={error}
                alerts={alerts}
                onAcknowledgeAlert={acknowledgeAlert}
                onReconnect={handleReconnect}
            />

            {/* Cartes des données vitales en temps réel */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {iotCards.map((card) => (
                    <Grid item xs={12} md={6} lg={4} key={card.id}>
                        <IoTDataCard {...card} />
                    </Grid>
                ))}
            </Grid>

            {/* Bouton de reconnexion manuelle */}
            {!isConnected && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={handleReconnect}
                        disabled={isConnecting}
                        sx={{
                            backgroundColor: colors.secondary[600],
                            color: colors.primary[100],
                            '&:hover': {
                                backgroundColor: colors.secondary[700],
                            },
                        }}
                    >
                        {isConnecting ? 'Connexion...' : 'Reconnecter'}
                    </Button>
                </Box>
            )}
        </Box>
    );
};
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)

export default IotFAJMA;