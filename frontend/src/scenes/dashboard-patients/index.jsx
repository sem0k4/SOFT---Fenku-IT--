<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from "react";
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
=======
>>>>>>> de5c7c3 (configuration du sidebar dashboard patients est ok)
import { useState, useEffect } from "react";
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
import { useState, useEffect } from "react";
=======
import { Outlet, Route, Routes } from "react-router-dom";
import Teleconsultation from "../teleconsultation";
import Documents from "../documents";
import Consultation from "../consultation";
import RDV from "../rdv";
import Messagerie from "../messagerie";
import Vaccination from "../vaccination";
import IotFAJMA from "../iot-fajma";
import { useState } from "react";
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
>>>>>>> 073ac72 (retouch configuration sidebar dashboard patient)
import { Box, Typography } from "@mui/material";
import HeaderDashboard from "../../components/shared/HeaderDashboard";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Link } from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import NavSub from "./components/NavSub";
import IntroDashboard from "./components/IntroDashboard";


const DashboardPatient = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    

    return (
        <Box className="flex flex-col">
=======
=======
>>>>>>> 073ac72 (retouch configuration sidebar dashboard patient)
=======
>>>>>>> 4acefeb (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
import DatasVitals from "./DatasVitals";
import RecentsConsultations from "./RecentsConsultations";

import TimerRDV from "./TimerRDV";
// import Card3 from "./ObjectFAJMA";
import { Link } from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AuthService from "../../services/auth";


const DashboardPatient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // État pour stocker les informations du patient
    const [patientInfo, setPatientInfo] = useState({
        salutation: "Bienvenue",
        nom: "Patient"
    });
    
    // Récupérer les informations du patient connecté au chargement du composant
    useEffect(() => {
        const userInfo = AuthService.getUserInfo();
        if (userInfo) {
            setPatientInfo({
                salutation: "Bienvenue", // Salutation fixe
                nom: userInfo.prenom || "Patient" // Utiliser le prénom de l'utilisateur ou "Patient" par défaut
            });
        }
    }, []);
    

    return (
        <Box>
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: {sm: 'row', xs: 'column'},
                    gap: '20px',
                    justifyContent: {sm: 'space-between', xs: 'center'},
                    alignItems: 'center',
                    marginTop: '0px',
                    marginBottom: '0px'
                }}
            >
                <HeaderDashboard
<<<<<<< HEAD
                    title="Dalal ak Jamm"
                    span="Fallou"
=======
                    title={patientInfo.salutation}
                    span={patientInfo.nom}
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
                    subtitle=""
                />
                <Link 
                    className="font-semibold p-2 rounded-lg md:w-1/3 xs:w-1/2 w-full flex items-center justify-center"
                    to="rdv"
                    style={{
                        textDecoration: 'none',
                        padding: 0,
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[800] : '#fcfcfc',
                        backgroundColor: colors.secondary[500], 
                    }}
                >
<<<<<<< HEAD
                     <AddOutlinedIcon />
                    <span >Prendre un rendez-vous</span>
                </Link>
            </Box>
            <IntroDashboard />
            <NavSub />
=======
                    <AddOutlinedIcon />
                    <span>Prendre un rendez-vous</span>
                </Link>
            </Box>
            <Box className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-0 gap-6">
                <RecentsConsultations />
            </Box>
            
            {/* Données vitales */}
            <DatasVitals />
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
        </Box>
    )   
}

export default DashboardPatient;
=======
import Sidebar from "../global/Sidebar";
=======
import SidebarDashboard from "../global/Sidebar"; 
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
import Topbar from "../global/Topbar";
=======
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
=======
import IdentityPatient from "./IdentityPatient";
import RecentsConsultations from "./RecentsConsultations";
import TimerRDV from "./TimerRDV";
import Card3 from "./ObjectFAJMA";
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)


const DashboardPatient = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box>
            <HeaderDashboard
                title="Dalal ak Jamm"
                span="Fallou"
                subtitle=""
            />
            <Box
                className="grid grid-cols-1 md:grid-cols-3 items-center gap-y-0 gap-6"
                sx={{
                
                }}
            >
                <IdentityPatient />
                <TimerRDV />
                <Card3 />
            </Box>
            <RecentsConsultations />
        </Box>
    )   
}

<<<<<<< HEAD
export default Dashboard;
>>>>>>> 692b537 (debut conception dashboard patient)
=======
export default DashboardPatient;
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
