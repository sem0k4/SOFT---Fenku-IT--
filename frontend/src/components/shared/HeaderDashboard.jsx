import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';



<<<<<<< HEAD
const HeaderDashboard = ({ title, span, subtitle }) => {    
=======
const HeaderDashboard = ({ title, subtitle }) => {    
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)

    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    return ( 
        <Box className="flex flex-col items-start w-full">
            <Typography 
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
                fontWeight='bold'
                sx={{ mb: "5px" }}
            >
                {title}
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
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