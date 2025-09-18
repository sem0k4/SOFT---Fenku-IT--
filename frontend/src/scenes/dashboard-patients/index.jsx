import { Box } from "@mui/material";
import HeaderDashboard from "../../components/shared/HeaderDashboard";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import { Link } from "react-router-dom";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import NavSub from "./components/NavSub";
import IntroDashboard from "./components/IntroDashboard";
import dataPatient from "./services/infosPatient";


const DashboardPatient = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { datasPatient, getDatasSuccess } = dataPatient();
    

    return (
        <Box className="flex flex-col">
            <Box 
                sx={{
                    display: 'flex',
                    flexDirection: {sm: 'row', xs: 'column'},
                    gap: '10px',
                    justifyContent: {sm: 'space-between', xs: 'center'},
                    marginTop: '0px',
                    marginBottom: '0px'
                }}
            >
                <HeaderDashboard
                    title={getDatasSuccess ? "Dalal ak Jamm " : "Completer votre profil patient"}
                    span={getDatasSuccess && datasPatient.prenom}
                    subtitle={!getDatasSuccess && "Il faut avoir un profil patient avant de pouvoir utiliser les services de FAJMA"}
                    alert={!getDatasSuccess && true}
                />
                <Link 
                    className="font-semibold p-2 rounded-lg md:w-1/3 xs:w-1/2 w-full flex items-center justify-center hover:opacity-70 active:opacity-70 duration-200"
                    to="rdv"
                    style={{
                        textDecoration: 'none',
                        padding: 0,
                        color: '#fcfcfc',
                        backgroundColor: colors.secondary[500], 
                    }}
                >
                     <AddOutlinedIcon />
                    <span >Prendre un rendez-vous</span>
                </Link>
            </Box>
            <IntroDashboard  />
            <NavSub />
        </Box>
    )   
}

export default DashboardPatient;