import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';



const HeaderDashboard = ({ title, span, subtitle }) => {    

    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    return ( 
        <Box className="flex flex-col items-start w-full">
            <Typography 
                variant='h3' 
                // color={colors.secondary[500]} 
                fontWeight='bold'
                sx={{ mb: "5px" }}
            >
                {title}
                {span && <span style={{ color: colors.secondary[500]}}> {span}</span>}
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