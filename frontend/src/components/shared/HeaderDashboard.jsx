import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';



const HeaderDashboard = ({ title, subtitle }) => {    

    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    return ( 
        <Box className="flex flex-col items-start w-full">
            <Typography 
                variant='h2' 
                color={colors.secondary[500]} 
                fontWeight='bold'
                sx={{ mb: "5px" }}
            >
                {title}
            </Typography>
            <Typography 
                variant='h5' 
                color={colors.blackAccent[100]} 
                sx={{ mb: "20px" }}
            >
                {subtitle}
            </Typography>
        </Box>
    );
}   

export default HeaderDashboard