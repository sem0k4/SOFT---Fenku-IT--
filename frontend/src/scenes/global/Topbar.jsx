<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Avatar, Box, IconButton, useTheme } from "@mui/material";
=======
import { Avatar, Box, IconButton, Link, useTheme } from "@mui/material";
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
>>>>>>> 073ac72 (retouch configuration sidebar dashboard patient)
import { Avatar, Box, IconButton, Link, useTheme } from "@mui/material";
=======
import { Box, IconButton, useTheme } from "@mui/material";
>>>>>>> 692b537 (debut conception dashboard patient)
<<<<<<< HEAD
>>>>>>> fc99c8a (debut conception dashboard patient)
=======
=======
import { Avatar, Box, IconButton, useTheme } from "@mui/material";
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
>>>>>>> 073ac72 (retouch configuration sidebar dashboard patient)
import InputBase from "@mui/material/InputBase";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
<<<<<<< HEAD
<<<<<<< HEAD
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SidebarMobile from "./SidebarMobile";
import { Link } from "react-router-dom";
import Logo1FAJMA from "../../assets/logo-fajma.png";
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SidebarMobile from "./SidebarMobile";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth";
<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
<<<<<<< HEAD
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
>>>>>>> 692b537 (debut conception dashboard patient)
<<<<<<< HEAD
>>>>>>> fc99c8a (debut conception dashboard patient)
=======
=======
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
>>>>>>> 073ac72 (retouch configuration sidebar dashboard patient)


const Topbar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 
    const colorMode = useContext(ColorModeContext);
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            try {
                await AuthService.logout();
                navigate('/login');
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
                // Même en cas d'erreur, on déconnecte localement
                navigate('/login');
            }
        }
    };
<<<<<<< HEAD
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
=======
=======

>>>>>>> 692b537 (debut conception dashboard patient)
>>>>>>> fc99c8a (debut conception dashboard patient)

    // console.log("theme", theme, "colors", colors, "colorMode", colorMode);
    

    return (
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        <Box 
            sx={{
<<<<<<< HEAD
                padding: '12px 30px 10px 12px',
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
            }}
            className="w-full flex lg:justify-end justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky z-10 top-0"    
=======
                padding: '20px 30px 10px 20px',
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
            }}
            className="w-full flex lg:justify-end justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0"    
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
        >
            {/* <Box 
                sx={{
                    display: { lg: "flex", md: "none"},
                }}
                backgroundColor={theme.palette.mode === 'dark' ? colors.blackAccent[400] : '#e4e4e480'}
=======
        <Box display="flex" justifyContent="space-between" p={2}>
            <Box 
                display="flex" 
                backgroundColor={theme.palette.mode === 'dark' ? colors.primary[400] : colors.blackAccent[900]}
>>>>>>> 692b537 (debut conception dashboard patient)
=======
        <Box display="flex" width="100%" height="80px" justifyContent="space-between" p={3}>
=======
        <Box 
            display="flex" 
            width="100%" 
            height="fit-content" 
            justifyContent="space-between" 
            borderColor={theme.palette.mode === 'dark' ? colors.blackAccent[500] : 'colors.blackAccent[800]'}
            className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700"    
        >
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
            <Box 
                display="flex" 
                height="34px"
                backgroundColor={theme.palette.mode === 'dark' ? colors.primary[400] : '#fcfcfc'}
>>>>>>> e45aa1b (configuration du sidebar dashboard patients est ok)
                borderRadius="3px"
            >
                <InputBase 
                    sx={{ ml: 2, flex: 1 }} 
                    placeholder="Rechercher..."
                />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
<<<<<<< HEAD
            </Box> */}
<<<<<<< HEAD
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
            <Box sx={{ display: "flex" }}>
                <Link
                    className="sm:flex hidden bg-gradient-to-r from-cyan-700/80 from-50% to-cyan-200 font-semibold cursor-pointer px-3 rounded-lg  w-full gap-2 duration-300 transition-all items-center justify-center"
                    to="#"
                    style={{
                        textDecoration: 'none',
                        padding: 0,
                        mr: 1,
                        fontSize: '15px',
                        fontWeight: 500,
                        color: '#fcfcfc',
                        transition: 'all 0.3s',
                    }}
                >
                    <span className="font-semibold">Assistant IA</span>
=======
            <SidebarMobile />
            <Box sx={{ display: "flex" }}>
                <Link
                    className="sm:flex hidden font-semibold cursor-pointer px-3 rounded-lg  w-full gap-2 duration-300 transition-all items-center justify-center"
                    to="#"
                    sx={{
                        textDecoration: 'none',
                        padding: 0,
                        mr: 1,
                        fontWeight: 500,
                        color: '#fcfcfc',
                        transition: 'all 0.3s',
                        background: 'linear-gradient(82deg,rgba(0, 120, 141, 1) 0%, rgba(97, 221, 255, 1) 100%)', 
                        '&:hover':{
                            background: 'linear-gradient(82deg,rgba(97, 221, 255, 1) 0%, rgba(0, 120, 141, 1) 100%)'
                        }
                    }}
                >
                    <span >Assistant IA</span>
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
                    <AutoAwesomeOutlinedIcon sx={{ fontSize: 'small' }} />
                </Link>
=======
            </Box>
            <Box display="flex">
>>>>>>> 692b537 (debut conception dashboard patient)
                <IconButton onClick={colorMode.toggleColorMode}>
                    {/* Afficher l'icône en fonction du mode de couleur */}
                    {theme.palette.mode === 'dark' ? (
                        <DarkModeOutlinedIcon />
                    ) : (
                        <LightModeOutlinedIcon />
                    )}
                </IconButton>
                <IconButton>
                    <NotificationsOutlinedIcon />
                </IconButton>
<<<<<<< HEAD
<<<<<<< HEAD
                <IconButton>
                    <Avatar
                        className="text-black shadow-sm font-semibold bg-transparent border border-black"
                        alt="Prenom nom"
                        src="/images/exemple_profile.webp"
                        sx={{ width: 30, height: 30 }}
=======
=======
>>>>>>> fc99c8a (debut conception dashboard patient)
                <IconButton onClick={handleLogout} sx={{ color: '#f44336' }}>
                     <LogoutOutlinedIcon />
                 </IconButton>
                <IconButton>
                    <Avatar
                        alt="Prenom nom"
                        src="/images/exemple_profile.webp"
                        sx={{ width: 24, height: 24 }}
>>>>>>> f575271 (Initial commit: FAJMA IoT Healthcare System with ESP32 integration)
                    />
=======
                <IconButton>
                    <SettingsOutlinedIcon />
                </IconButton>
                {/* <IconButton>
                    <PersonOutlinedIcon />
<<<<<<< HEAD
>>>>>>> 692b537 (debut conception dashboard patient)
                </IconButton>
=======
                </IconButton> */}
                <Box display="flex" justifyContent="center" alignItems="center">
                    {/* <img
                        alt="profile-user"
                        src={`/images/exemple_profile.webp`}
                        className="w-6 h-6 ml-3 rounded-full"
                    /> */}
                    <Avatar
                        alt="Prenom nom"
                        src="/images/exemple_profile.webp"
                        sx={{ width: 24, height: 24, ml: 1 }}
                    />
                </Box>
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
            </Box>
        </Box>
    )
}

export default Topbar;