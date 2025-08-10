import { useState } from "react";
import { Box, Typography } from "@mui/material";
import HeaderDashboard from "../../components/shared/HeaderDashboard";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import DatasVitals from "./DatasVitals";
import RecentsConsultations from "./RecentsConsultations";
// import TimerRDV from "./TimerRDV";
// import Card3 from "./ObjectFAJMA";
import { Link } from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import IntroDashboard from "./IntroDashboard";


const DashboardPatient = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    

    return (
        <Box>
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
                    title="Dalal ak Jamm"
                    span="Fallou"
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
                     <AddOutlinedIcon />
                    <span >Prendre un rendez-vous</span>
                </Link>
            </Box>
            <IntroDashboard />
            <Box className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-0 gap-6">
                <RecentsConsultations />
            </Box>
            <DatasVitals />
        </Box>
    )   
}

export default DashboardPatient;