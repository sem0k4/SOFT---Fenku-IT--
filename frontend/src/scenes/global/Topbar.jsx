import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { ColorModeContext, tokens } from "../../theme";
import { useContext, useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SidebarMobile from "./SidebarMobile";
import { Link } from "react-router-dom";
import Logo1FAJMA from "../../assets/logo-fajma.png";
import MenuProfilePatient from "./components/MenuProfilePatient";
import MenuNotifications from "./components/MenuNotifications";
import dataPatient from "../dashboard-patients/services/infosPatient";


const Topbar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 
    const colorMode = useContext(ColorModeContext);

    const { datasPatient, getDatasSuccess } = dataPatient()
    // console.log(datasPatient);
    // console.log(getDatasSuccess);
    

    return (
        <Box 
            sx={{
                padding: '14px 12px 12px 12px',
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
            }}
            className="w-full flex lg:justify-end justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky z-10 top-0"    
        >
            <Box sx={{ display: 'flex' }}>
                <SidebarMobile />
                <Link className="mt-1 lg:hidden block" to="/">
                    <img
                        className="w-28 h-fit"
                        src={Logo1FAJMA}
                        alt="E-FAJMA votre partenaire de sante"
                    />
                </Link>
            </Box>
            <Box 
                sx={{ 
                    display: "flex",
                    flexDirection: 'row',
                    alignItems: 'center',
                }}
            >
                <Link
                    className="sm:flex hidden bg-gradient-to-r from-cyan-700/80 from-50% to-cyan-200 font-semibold cursor-pointer px-3 rounded-lg  w-full gap-2 duration-300 transition-all items-center justify-center"
                    to="#"
                    style={{
                        textDecoration: 'none',
                        padding: '8px 0',
                        mr: 1,
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#fcfcfc',
                        transition: 'all 0.3s',
                    }}
                >
                    <span className="font-semibold">Assistant IA</span>
                    <AutoAwesomeOutlinedIcon sx={{ fontSize: 'small' }} />
                </Link>
                <IconButton 
                    onClick={colorMode.toggleColorMode}
                    sx={{
                        margin: '0 0 0 8px'
                    }}
                >
                    {/* Afficher l'icône en fonction du mode de couleur */}
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <MenuNotifications />
                <MenuProfilePatient
                    prenom={getDatasSuccess && datasPatient.prenom}
                    nom={getDatasSuccess && datasPatient.nom}
                />
            </Box>
        </Box>
    )
}

export default Topbar;