import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InfoIcon from '@mui/icons-material/Info';
import { tokens } from '../theme';

const IoTDataCard = ({ 
    title, 
    value, 
    unit, 
    subtitle, 
    icon: Icon, 
    color, 
    normalRange, 
    minValue = 0, 
    maxValue = 100,
    trend = null,
    isRealTime = false 
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [previousValue, setPreviousValue] = useState(null);
    const [currentTrend, setCurrentTrend] = useState('stable');
    const [isUpdating, setIsUpdating] = useState(false);

    // Effet pour détecter les changements de valeur et calculer la tendance
    useEffect(() => {
        if (value !== '--' && value !== null && value !== undefined) {
            const numValue = parseFloat(value);
            
            if (previousValue !== null && !isNaN(numValue)) {
                const diff = numValue - previousValue;
                const threshold = (maxValue - minValue) * 0.02; // 2% du range
                
                if (Math.abs(diff) > threshold) {
                    setCurrentTrend(diff > 0 ? 'up' : 'down');
                    setIsUpdating(true);
                    
                    // Animation de mise à jour
                    setTimeout(() => setIsUpdating(false), 1000);
                } else {
                    setCurrentTrend('stable');
                }
            }
            
            setPreviousValue(numValue);
        }
    }, [value, previousValue, maxValue, minValue]);

    // Fonction pour déterminer si une valeur est dans la plage normale
    const getValueStatus = () => {
        if (value === '--' || !value) return 'unknown';
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'unknown';
        
        // Logique spécifique selon le type de mesure
        if (unit === '%') { // SPO2
            return numValue >= 95 && numValue <= 100 ? 'normal' : 'abnormal';
        } else if (unit === '°C') { // Température
            return numValue >= 36.1 && numValue <= 37.2 ? 'normal' : 'abnormal';
        } else if (unit === 'bpm') { // Fréquence cardiaque
            return numValue >= 60 && numValue <= 100 ? 'normal' : 'abnormal';
        }
        
        return 'unknown';
    };

    // Fonction pour calculer le pourcentage pour la barre de progression
    const getProgressValue = () => {
        if (value === '--' || !value) return 0;
        
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 0;
        
        return Math.min(Math.max(((numValue - minValue) / (maxValue - minValue)) * 100, 0), 100);
    };

    // Fonction pour obtenir l'icône de tendance
    const getTrendIcon = () => {
        switch (trend || currentTrend) {
            case 'up':
                return <TrendingUpIcon sx={{ color: colors.greenAccent[500], fontSize: 20 }} />;
            case 'down':
                return <TrendingDownIcon sx={{ color: colors.redAccent[500], fontSize: 20 }} />;
            case 'stable':
            default:
                return <TrendingFlatIcon sx={{ color: colors.grey[400], fontSize: 20 }} />;
        }
    };

    const status = getValueStatus();
    const progressValue = getProgressValue();

    // Styles pour les différents états
    const cardStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc',
        boxShadow: `0px 0px 15px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)'}`,
        border: `1px solid ${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.grey[200]}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0px 5px 20px ${theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.1)'}`
        },
        ...(isUpdating && {
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
                animation: 'shimmer 1s ease-in-out',
                zIndex: 1
            }
        })
    };

    const iconContainerStyle = {
        backgroundColor: color,
        borderRadius: '50%',
        padding: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: `0px 4px 12px ${color}40`,
        transition: 'transform 0.3s ease',
        ...(isUpdating && {
            transform: 'scale(1.1)'
        })
    };

    const statusColors = {
        normal: { bg: colors.greenAccent[200], text: colors.greenAccent[800] },
        abnormal: { bg: colors.redAccent[200], text: colors.redAccent[800] },
        unknown: { bg: colors.grey[200], text: colors.grey[800] }
    };

    return (
        <Box 
            className="p-6 rounded-lg flex flex-col relative"
            sx={cardStyle}
        >
            {/* Indicateur temps réel */}
            {isRealTime && (
                <Box 
                    className="absolute top-2 right-2 w-3 h-3 rounded-full"
                    sx={{
                        backgroundColor: colors.greenAccent[500],
                        animation: 'pulse 2s infinite'
                    }}
                />
            )}

            {/* En-tête avec icône et statut */}
            <Box className="flex items-center justify-between mb-4">
                <Box sx={iconContainerStyle}>
                    <Icon sx={{ color: '#fcfcfc', fontSize: 45 }} />
                </Box>
                
                <Box className="flex items-center gap-2">
                    {getTrendIcon()}
                    <Box 
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        sx={{
                            backgroundColor: statusColors[status].bg,
                            color: statusColors[status].text
                        }}
                    >
                        {status === 'normal' ? 'Normal' : 
                         status === 'abnormal' ? 'Anormal' : 'Inconnu'}
                    </Box>
                </Box>
            </Box>
            
            {/* Titre */}
            <Typography variant="h6" className="font-bold mb-2" sx={{ color: colors.grey[100] }}>
                {title}
            </Typography>
            
            {/* Valeur principale */}
            <Box className="flex items-baseline gap-1 mb-3">
                <Typography 
                    variant="h3" 
                    className="font-bold"
                    sx={{ 
                        color: color,
                        transition: 'all 0.3s ease',
                        ...(isUpdating && {
                            transform: 'scale(1.05)'
                        })
                    }}
                >
                    {value}
                </Typography>
                <Typography variant="h5" sx={{ color: color }}>
                    {unit}
                </Typography>
            </Box>
            
            {/* Barre de progression */}
            <Box className="mb-3">
                <LinearProgress 
                    variant="determinate" 
                    value={progressValue}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.grey[300],
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: color,
                            borderRadius: 4,
                            transition: 'transform 0.5s ease'
                        }
                    }}
                />
            </Box>
            
            {/* Sous-titre */}
            <Typography variant="body2" className="text-gray-500 mb-2">
                {subtitle}
            </Typography>
            
            {/* Plage normale avec info */}
            <Box className="flex items-center justify-between">
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                    Plage normale: {normalRange}
                </Typography>
                
                <Tooltip title={`Valeur actuelle: ${value}${unit}. Plage normale: ${normalRange}`}>
                    <IconButton size="small">
                        <InfoIcon sx={{ fontSize: 16, color: colors.grey[400] }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Styles CSS pour les animations */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes shimmer {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `}</style>
        </Box>
    );
};

export default IoTDataCard;
