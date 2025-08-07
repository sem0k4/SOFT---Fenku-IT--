import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";


const Topbar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 
    const colorMode = useContext(ColorModeContext);


    // console.log("theme", theme, "colors", colors, "colorMode", colorMode);
    

    return (
        <Box 
            display="flex" 
            width="100%" 
            height="fit-content" 
            justifyContent="space-between" 
            borderColor={theme.palette.mode === 'dark' ? colors.blackAccent[500] : 'colors.blackAccent[800]'}
            className="flex items-center pb-3 border-b border-gray-200 dark:border-gray-700"    
        >
            <Box 
                display="flex" 
                height="34px"
                backgroundColor={theme.palette.mode === 'dark' ? colors.primary[400] : '#fcfcfc'}
                borderRadius="3px"
            >
                <InputBase 
                    sx={{ ml: 2, flex: 1 }} 
                    placeholder="Rechercher..."
                />
                <IconButton type="button" sx={{ p: 1 }}>
                    <SearchIcon />
                </IconButton>
            </Box>
            <Box display="flex">
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
                    <SettingsOutlinedIcon />
                </IconButton>
                {/* <IconButton>
                    <PersonOutlinedIcon />
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
            </Box>
        </Box>
    )
}

export default Topbar;