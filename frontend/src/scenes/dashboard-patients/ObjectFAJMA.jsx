import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { Box, Typography } from "@mui/material";

export default function ObjectFAJMA() {

    const theme = useTheme()
    const colors = tokens(theme.palette.colors)

    return (
        <Box 
            className="h-60 my-8 rounded-lg p-3 flex flex-col gap-4 justify-center"
            sx={{
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : '#fcfcfc',
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
            }}
        >
            <Typography
                className=""
                variant="h3"
                sx={{
                    fontWeight: 500,
                }}
            >Auto-consultation</Typography>
            <Typography 
                variant="p"
                sx={{
                    fontWeight: 400,
                    fontSize: "18px"
                }}    
            >Faites votre propre consultation grace à FAJMA+</Typography>
        </Box>
    )
}