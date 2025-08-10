<<<<<<< HEAD
import { Box, Typography, useTheme, Alert, CircularProgress } from "@mui/material";
=======
import { Box, Typography, useTheme } from "@mui/material";
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)
import { tokens } from "../../theme";
import MonitorWeightTwoToneIcon from '@mui/icons-material/MonitorWeightTwoTone';
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';

<<<<<<< HEAD
import { useBiometrics } from "../../hooks";
import { useState, useEffect } from "react";


export default function DatasVitals() {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // Utiliser le hook personnalisé pour récupérer les données biométriques
    const { biometrics, loading, error } = useBiometrics();
    
    // Tableau de données pour les signes vitaux avec valeurs par défaut
    const [vitalsData, setVitalsData] = useState([
        {
            id: 1,
            title: "Poids",
            value: "--",
            unit: "Kg",
            icon: MonitorWeightTwoToneIcon
        },
        {
            id: 2,
            title: "Taille",
            value: "--",
            unit: "cm",
            icon: HeightOutlinedIcon
        },
        {
            id: 3,
            title: "Groupe sanguin",
            value: "--",
            unit: "",
            icon: BloodtypeOutlinedIcon
        },

    ]);
    
    // Mettre à jour les données vitales lorsqu'elles sont chargées
    useEffect(() => {
        if (biometrics && biometrics.length > 0) {
            // Prendre la première biométrie disponible (ou celle du patient connecté)
            const currentBiometric = biometrics[0];
            
            setVitalsData([
                {
                    id: 1,
                    title: "Poids",
                    value: currentBiometric.poids || "--",
                    unit: "Kg",
                    icon: MonitorWeightTwoToneIcon
                },
                {
                    id: 2,
                    title: "Taille",
                    value: currentBiometric.taille || "--",
                    unit: "cm",
                    icon: HeightOutlinedIcon
                },
                {
                    id: 3,
                    title: "Groupe sanguin",
                    value: currentBiometric.groupesanguin || "--",
                    unit: "",
                    icon: BloodtypeOutlinedIcon
                },
            ]);
        } else if (error && error.includes('Authentification')) {
            // Données de démonstration quand l'utilisateur n'est pas connecté
            setVitalsData([
                {
                    id: 1,
                    title: "Poids",
                    value: "75",
                    unit: "Kg",
                    icon: MonitorWeightTwoToneIcon
                },
                {
                    id: 2,
                    title: "Taille",
                    value: "175",
                    unit: "cm",
                    icon: HeightOutlinedIcon
                },
                {
                    id: 3,
                    title: "Groupe sanguin",
                    value: "O+",
                    unit: "",
                    icon: BloodtypeOutlinedIcon
                },
            ]);
        }
    }, [biometrics, error]);
    
    // Styles communs
    const containerStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc',
        boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
    };
    
    const cardStyle = {
        border: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
    };
    
    const iconStyle = {
        color: '#fcfcfc',
        fontSize: 40,
        borderRadius: '50%',
        padding: '5px',
        backgroundColor: colors.secondary[500],
    };
    
    const textContainerStyle = {
        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
    };
    
    const valueStyle = {
        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100]
    };

    return (
        <div 
            style={containerStyle} 
            className="mb-6 p-4 rounded-lg flex flex-col gap-3"
=======

export default function DatasVitals() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div 
            style={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
            }} 
<<<<<<< HEAD
            className="my-3 p-4 rounded-lg flex flex-col gap-3"
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)
=======
            className="mb-6 p-4 rounded-lg flex flex-col gap-3"
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
        >
            <Typography
                variant="h5"
                sx={{ 
                    fontWeight: 600, 
                    width: '100%', 
                    textAlign: 'left',
                    borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                }}
                className="border-b pb-2"
            >
                Données vitales
            </Typography>
<<<<<<< HEAD
            
            {error && (
                <Alert severity="error" className="w-full">{error}</Alert>
            )}
            
            {loading ? (
                <Box className="w-full flex justify-center py-4">
                    <CircularProgress />
                </Box>
            ) : (
                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-3">
                {vitalsData.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <div 
                            key={item.id}
                            className="flex flex-row gap-2 p-2 rounded-lg"
                            style={cardStyle}
                        >
                            <IconComponent sx={iconStyle} />
                            <div
                                className="flex flex-col"
                                style={textContainerStyle}
                            >
                                <Typography 
                                    sx={{ fontWeight: 400 }} 
                                    variant="h5"
                                >
                                    {item.title}
                                </Typography>
                                <Typography sx={{ fontWeight: 400 }} variant="p">
                                    {item.unit ? (
                                        <>
                                            <span className="font-semibold" style={valueStyle}>
                                                {item.value}
                                            </span> {item.unit}
                                        </>
                                    ) : (
                                        <Typography 
                                            sx={{ 
                                                fontWeight: 600,
                                                textAlign: 'left',
                                                fontSize: '15px',
                                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100],
                                            }} 
                                            variant="p"
                                        >
                                            {item.value}
                                        </Typography>
                                    )}
                                </Typography>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}
=======
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                    }}
                >
                    <MonitorWeightTwoToneIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Poids</Typography>
                        <Typography sx={{ fontWeight: 400 }} variant="p">
                            <span className="font-semibold" style={{ 
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100]
                            }}>95</span> Kg
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]
                    }}
                >
                    <HeightOutlinedIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Taille</Typography>
                        <Typography sx={{ fontWeight: 400 }} variant="p">
                            <span className="font-semibold" style={{ 
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100]
                            }}>189</span> cm
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]
                    }}
                >
                    <BloodtypeOutlinedIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Groupe sanguin</Typography>
                        <Typography 
                            sx={{ 
                                fontWeight: 600,
                                textAlign: 'left',
                                fontSize: '15px',
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100],
                            }} 
                            variant="p"
                        >
                            O -
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]
                    }}
                >
                    <BloodtypeOutlinedIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Groupe sanguin</Typography>
                        <Typography 
                            sx={{ 
                                fontWeight: 600,
                                textAlign: 'left',
                                fontSize: '15px',
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100],
                            }} 
                            variant="p"
                        >
                            O -
                        </Typography>
                    </div>
                </div>
            </div>
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)
        </div>
    )
}