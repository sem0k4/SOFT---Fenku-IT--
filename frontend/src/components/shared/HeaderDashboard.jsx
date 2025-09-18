import React, { useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { RiErrorWarningLine } from "react-icons/ri";




const HeaderDashboard = ({ title, span, subtitle, alert }) => {    

    const theme = useTheme();
    const colors = tokens(theme.palette.mode)

    return ( 
        <Box className="flex flex-col gap-2 items-start">
            <Box className="flex flex-row gap-1">
                {alert &&
                    <RiErrorWarningLine className="text-red-500 text-3xl -mt-0.5" />
                }
                <Typography
                    variant='h3'
                    // color={alert && 'red'}
                    fontWeight='bold'
                    textAlign='left'
                >
                    {title}
                    {span && <span style={{ color: colors.secondary[500]}}> {span}</span>}
                </Typography>
            </Box>
            <Typography 
                variant='h5' 
                color={theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]} 
                textAlign="left"
            >
                {subtitle}
            </Typography>
        </Box>
    );
}   

export default HeaderDashboard