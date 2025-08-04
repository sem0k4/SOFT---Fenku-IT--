import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';



<<<<<<< HEAD
<<<<<<< HEAD
const HeaderDashboard = ({ title, span, subtitle }) => {    
=======
const HeaderDashboard = ({ title, subtitle }) => {    
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
=======
const HeaderDashboard = ({ title, span, subtitle }) => {    
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)

    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    return ( 
        <Box className="flex flex-col items-start w-full">
            <Typography 
<<<<<<< HEAD
<<<<<<< HEAD
                variant='h3' 
                // color={colors.secondary[500]} 
                fontWeight='bold'
            >
                {title}
                {span && <span style={{ color: colors.secondary[500]}}> {span}</span>}
=======
                variant='h2' 
                color={colors.secondary[500]} 
=======
                variant='h3' 
                // color={colors.secondary[500]} 
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
                fontWeight='bold'
                sx={{ mb: "5px" }}
            >
                {title}
<<<<<<< HEAD
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
=======
                {span && <span style={{ color: colors.secondary[500]}}> {span}</span>}
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
            </Typography>
            <Typography 
                variant='h5' 
                color={colors.blackAccent[100]} 
<<<<<<< HEAD
=======
                sx={{ mb: "20px" }}
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
            >
                {subtitle}
            </Typography>
        </Box>
    );
}   

export default HeaderDashboard