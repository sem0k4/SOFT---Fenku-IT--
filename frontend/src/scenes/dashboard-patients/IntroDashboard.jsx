import { Box, Typography, useTheme, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { tokens } from "../../theme";
import timerRDV from "./TimerRDV";
import { useDashboardStats } from "../../hooks";
import { Alert } from "@mui/material";

const IntroDashboard = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { dateRDV, formattedDate } = timerRDV()
    
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
}

export default IntroDashboard;