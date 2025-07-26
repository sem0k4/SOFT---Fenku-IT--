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


const DashboardPatient = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    // const [isSidebar, setIsSidebar] = useState(true);
    const colorDivParent = theme.palette.mode === 'dark' ? '#e4e4e4' : '#fcfcfc';

    return (
        <div>
            <HeaderDashboard
                title="Dalal ak Jamm Fallou"
                subtitle=""
            />
            <Box className={`bg-[${colorDivParent}] rounded-lg p-3 h-64 w-92`}>

            </Box>
        </div>
    )   
}

export default DashboardPatient;