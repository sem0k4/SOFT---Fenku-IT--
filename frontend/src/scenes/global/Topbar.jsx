import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import SidebarMobile from "./SidebarMobile";
import { Link } from "react-router-dom";
import Logo1FAJMA from "../../assets/logo-fajma.png";


const Topbar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 
    const colorMode = useContext(ColorModeContext);


    // console.log("theme", theme, "colors", colors, "colorMode", colorMode);
    

    return (
        <Box 
            sx={{
                padding: '12px 30px 10px 12px',
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
            }}
            className="w-full flex lg:justify-end justify-between items-center border-b border-gray-200 dark:border-gray-700 sticky z-10 top-0"    
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
                <IconButton>
                    <Avatar
                        className="text-black shadow-sm font-semibold bg-transparent border border-black"
                        alt="Prenom nom"
                        src="/images/exemple_profile.webp"
                        sx={{ width: 30, height: 30 }}
                    />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Topbar;