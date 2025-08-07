import { Avatar, Box, IconButton, useTheme } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import { ColorModeContext, tokens } from "../../theme";
import { useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";


const Topbar = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode); 
    const colorMode = useContext(ColorModeContext);


    // console.log("theme", theme, "colors", colors, "colorMode", colorMode);
    

    return (
        <Box 
            sx={{
                display: "flex",
                width: "100%",
                padding: '20px 30px 10px 20px',
                justifyContent: { md: "space-between", xs: "end" },
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                borderColor: `${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[900]}`,
            }}
            className="flex items-center border-b border-gray-200 dark:border-gray-700 sticky top-0"    
        >
            <Box 
                sx={{
                    display: { md: "flex", xs: "none"},
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
            </Box>
            <Box sx={{ display: "flex" }}>
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
                <Box display="flex" justifyContent="center" alignItems="center">
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