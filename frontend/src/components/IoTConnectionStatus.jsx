import React from 'react';
import { Box, Typography, Chip, Alert, IconButton, Collapse } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import SyncIcon from '@mui/icons-material/Sync';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import { tokens } from '../theme';

const IoTConnectionStatus = ({ 
    connectionStatus, 
    isConnecting, 
    error, 
    alerts = [], 
    onAcknowledgeAlert,
    onClearError,
    lastUpdate 
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Déterminer l'icône et la couleur selon le statut
    const getConnectionInfo = () => {
        if (isConnecting) {
            return {
                icon: <SyncIcon className="animate-spin" />,
                color: colors.blueAccent[500],
                text: 'Connexion...',
                bgColor: colors.blueAccent[200]
            };
        }
        
        switch (connectionStatus) {
            case 'OPEN':
                return {
                    icon: <WifiIcon />,
                    color: colors.greenAccent[500],
                    text: 'Connecté',
                    bgColor: colors.greenAccent[200]
                };
            case 'CLOSED':
            case 'CLOSING':
                return {
                    icon: <WifiOffIcon />,
                    color: colors.redAccent[500],
                    text: 'Déconnecté',
                    bgColor: colors.redAccent[200]
                };
            case 'CONNECTING':
                return {
                    icon: <SyncIcon className="animate-spin" />,
                    color: colors.blueAccent[500],
                    text: 'Connexion...',
                    bgColor: colors.blueAccent[200]
                };
            default:
                return {
                    icon: <WifiOffIcon />,
                    color: colors.grey[500],
                    text: 'Inconnu',
                    bgColor: colors.grey[200]
                };
        }
    };

    const connectionInfo = getConnectionInfo();

    return (
        <Box className="mb-4">
            {/* Statut de connexion */}
            <Box className="flex items-center justify-between mb-3">
                <Box className="flex items-center gap-3">
                    <Chip
                        icon={connectionInfo.icon}
                        label={connectionInfo.text}
                        sx={{
                            backgroundColor: connectionInfo.bgColor,
                            color: connectionInfo.color,
                            fontWeight: 'bold',
                            '& .MuiChip-icon': {
                                color: connectionInfo.color
                            }
                        }}
                    />
                    
                    {lastUpdate && connectionStatus === 'OPEN' && (
                        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                            Dernière mise à jour: {lastUpdate}
                        </Typography>
                    )}
                </Box>
                
                {alerts.length > 0 && (
                    <Chip
                        icon={<NotificationsIcon />}
                        label={`${alerts.length} alerte${alerts.length > 1 ? 's' : ''}`}
                        color="warning"
                        variant="outlined"
                    />
                )}
            </Box>

            {/* Message d'erreur */}
            <Collapse in={!!error}>
                <Alert 
                    severity="error" 
                    sx={{ mb: 2 }}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={onClearError}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                >
                    {error}
                </Alert>
            </Collapse>

            {/* Alertes */}
            {alerts.map((alert, index) => (
                <Collapse key={alert.id || index} in={!alert.acknowledged}>
                    <Alert 
                        severity={alert.niveau === 'CRITIQUE' ? 'error' : 'warning'}
                        sx={{ mb: 1 }}
                        action={
                            <IconButton
                                aria-label="acknowledge"
                                color="inherit"
                                size="small"
                                onClick={() => onAcknowledgeAlert && onAcknowledgeAlert(alert.id)}
                            >
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }
                    >
                        <Typography variant="subtitle2" className="font-semibold">
                            {alert.type || 'Alerte IoT'}
                        </Typography>
                        <Typography variant="body2">
                            {alert.message || alert.description}
                        </Typography>
                        {alert.timestamp && (
                            <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                                {new Date(alert.timestamp).toLocaleString()}
                            </Typography>
                        )}
                    </Alert>
                </Collapse>
            ))}
        </Box>
    );
};

export default IoTConnectionStatus;
