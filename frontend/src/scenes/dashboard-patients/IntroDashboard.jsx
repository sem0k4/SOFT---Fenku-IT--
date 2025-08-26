<<<<<<< HEAD
import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
=======
import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import { tokens } from "../../theme";
import timerRDV from "./TimerRDV";
<<<<<<< HEAD
<<<<<<< HEAD
import { useDashboardStats } from "../../hooks";
import { Alert } from "@mui/material";
=======
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
=======
import { Link } from "react-router-dom";
>>>>>>> ea6b6d1 (accueil du dashboard patient en se referant sur le prototype figma)

const IntroDashboard = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { dateRDV, formattedDate } = timerRDV()
<<<<<<< HEAD
    
    // Utiliser le hook personnalisé pour récupérer les statistiques du dashboard
    const { dashboardStats, loading, error, fetchDashboardStats } = useDashboardStats();

    // Données pour les cartes d'information avec valeurs par défaut
    const [dashboardCards, setDashboardCards] = useState([
        {
            id: 1,
            title: "Total consultations",
            value: "--",
            subtitle: "sur les 30 derniers jours",
            icon: CalendarMonthOutlinedIcon
        },
        {
            id: 2,
            title: "Total téléconsultations",
            value: "--",
            subtitle: "sur les 30 derniers jours",
            icon: VideoCameraFrontOutlinedIcon
        },
        {
            id: 3,
            title: "Prochain rendez-vous",
            value: formattedDate,
            subtitle: (
                <>
=======

    // console.log(formattedDate);
    



    return (
        <Box className="mt-6 mb-4 gap-3 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Prochain rendez-vous
                    </Typography>
                    <CalendarMonthOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500],
                        }}
                    >
                        24 Août
                    </Typography>
                    <Typography
                        variant="h6"
                        className="text-left"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >10:30 avec Dr Mbengue</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='rdv'
               >
                    <span>Voir plus de détail</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Médicaments
                    </Typography>
                    <CalendarMonthOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500]
                        }}
                    >
                        4 actives
                    </Typography>
                    <Typography
                        className="text-left"
                        variant="h6"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >prochain dans 6 heures</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='#'
               >
                    <span>Voir les prescriptions</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
<<<<<<< HEAD
                >
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
                    dans
                    <span className={`${dateRDV.month !== 0 ? 'inline' : 'hidden'}`}>  {dateRDV.month} mois</span>
                    <span className={`${dateRDV.days !== 0 ? 'inline' : 'hidden'}`}> {dateRDV.days} jours</span>
                    <span className={`${(dateRDV.hours !== 0  && dateRDV.month === 0) ? 'inline' : 'hidden'}`}> {dateRDV.hours} h</span>
                    <span className={`${(dateRDV.minutes !== 0 && dateRDV.days === 0) ? 'inline' : 'hidden'}`}> {dateRDV.minutes} min</span>
                    <span className={`${(dateRDV.seconds !== 0 && dateRDV.days === 0) ? 'inline' : 'hidden' }`}> {dateRDV.seconds} s</span>
<<<<<<< HEAD
                </>
            ),
            icon: ScheduleOutlinedIcon
        }
    ]);

    // Mettre à jour les cartes lorsque les données sont chargées
    useEffect(() => {
        if (dashboardStats) {
            setDashboardCards([
                {
                    id: 1,
                    title: "Total consultations",
                    value: dashboardStats.total_consultations || "0",
                    subtitle: "sur les 30 derniers jours",
                    icon: CalendarMonthOutlinedIcon
                },
                {
                    id: 2,
                    title: "Total téléconsultations",
                    value: dashboardStats.total_teleconsultations || "0",
                    subtitle: "sur les 30 derniers jours",
                    icon: VideoCameraFrontOutlinedIcon
                },
                {
                    id: 3,
                    title: "Prochain rendez-vous",
                    value: formattedDate,
                    subtitle: (
                        <>
                            dans
                            <span className={`${dateRDV.month !== 0 ? 'inline' : 'hidden'}`}>  {dateRDV.month} mois</span>
                            <span className={`${dateRDV.days !== 0 ? 'inline' : 'hidden'}`}> {dateRDV.days} jours</span>
                            <span className={`${(dateRDV.hours !== 0  && dateRDV.month === 0) ? 'inline' : 'hidden'}`}> {dateRDV.hours} h</span>
                            <span className={`${(dateRDV.minutes !== 0 && dateRDV.days === 0) ? 'inline' : 'hidden'}`}> {dateRDV.minutes} min</span>
                            <span className={`${(dateRDV.seconds !== 0 && dateRDV.days === 0) ? 'inline' : 'hidden' }`}> {dateRDV.seconds} s</span>
                        </>
                    ),
                    icon: ScheduleOutlinedIcon
                }
            ]);
        }
    }, [dashboardStats, formattedDate, dateRDV]);

    // Styles communs pour les cartes
    const cardStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
        boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
    };

    const iconStyle = {
        color: '#fcfcfc',
        fontSize: 40,
        borderRadius: '50%',
        padding: '6px',
        backgroundColor: colors.secondary[500],
    };

    const titleStyle = {
        fontWeight: 400,
        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
    };

    const valueStyle = {
        fontWeight: 800,
        color: colors.blackAccent[100],
    };

    const subtitleStyle = {
        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
    };

    return (
        <Box className="mt-6 mb-4 gap-7 grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            {error && (
                <Box className="col-span-full">
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}
            {loading && (
                <Box className="col-span-full flex justify-center">
                    <CircularProgress />
                </Box>
            )}
            {dashboardCards.map((card) => (
                <Box 
                    key={card.id}
                    className="flex flex-col gap-2 p-4 rounded-lg justify-start items-start"
                    sx={cardStyle}    
                >
                    <Box className="flex flex-row gap-3 items-center">
                        <card.icon sx={iconStyle} />
                        <Box className="flex flex-col items-start">
                            <Typography
                                variant="h5"
                                sx={titleStyle}
                            >
                                {card.title}
                            </Typography>
                            <Typography
                                variant={card.id === 3 ? "h5" : "h3"}
                                sx={valueStyle}
                            >
                                {card.value}
                            </Typography>
                        </Box>
                    </Box>
                    <Typography 
                        variant="p"
                        sx={subtitleStyle}
                    >
                        {card.subtitle}
                    </Typography>
                </Box>
            ))}
        </Box>
    )
=======
                </Typography>
=======
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Total consultations
                    </Typography>
                    <ContactsOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500], 
                        }}
                    >
                        13
                    </Typography>
                    <Typography
                        variant="h6"
                        className="text-left"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >sur les 30 derniers jours</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='consultation'
               >
                    <span>Voir les consultations</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Résultats test
                    </Typography>
                    <CalendarMonthOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500], 
                        }}
                    >
                        2 nouveaux
                    </Typography>
                    <Typography
                        variant="h6"
                        className="text-left"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >analyse sanguine du 12 Aout</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='#'
               >
                    <span>Voir les détail</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
>>>>>>> ea6b6d1 (accueil du dashboard patient en se referant sur le prototype figma)
            </Box>
        </Box>
    )

>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
}

export default IntroDashboard;