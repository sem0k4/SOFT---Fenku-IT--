import { Avatar, Box, IconButton, Link, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SidebarMobile from "./SidebarMobile";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/auth";


const Topbar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 
    const colorMode = useContext(ColorModeContext);
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

    // console.log("theme", theme, "colors", colors, "colorMode", colorMode);
    

    return (
        <Box 
            sx={{
                padding: '20px 30px 10px 20px',
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
            }}
            className="w-full flex lg:justify-end justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky top-0"    
        >
            {/* <Box 
                sx={{
                    display: { lg: "flex", md: "none"},
                }}
                backgroundColor={theme.palette.mode === 'dark' ? colors.blackAccent[400] : '#e4e4e480'}
                borderRadius="3px"
            >
                <InputBase 
                    sx={{ ml: 2, flex: 1 }} 
                    placeholder="Rechercher..."
                />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box> */}
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
                    <AutoAwesomeOutlinedIcon sx={{ fontSize: 'small' }} />
                </Link>
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
                <IconButton onClick={handleLogout} sx={{ color: '#f44336' }}>
                     <LogoutOutlinedIcon />
                 </IconButton>
                <IconButton>
                    <Avatar
                        alt="Prenom nom"
                        src="/images/exemple_profile.webp"
                        sx={{ width: 24, height: 24 }}
                    />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Topbar;