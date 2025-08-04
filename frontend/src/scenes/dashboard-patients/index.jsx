import { Outlet, Route, Routes } from "react-router-dom";
import Teleconsultation from "../teleconsultation";
import Documents from "../documents";
import Consultation from "../consultation";
import RDV from "../rdv";
import Messagerie from "../messagerie";
import Vaccination from "../vaccination";
import IotFAJMA from "../iot-fajma";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import HeaderDashboard from "../../components/shared/HeaderDashboard";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import IdentityPatient from "./IdentityPatient";
import RecentsConsultations from "./RecentsConsultations";
import TimerRDV from "./TimerRDV";
import Card3 from "./ObjectFAJMA";


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

export default DashboardPatient;