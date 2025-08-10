import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import { tokens } from "../../theme";
import timerRDV from "./TimerRDV";

const IntroDashboard = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const { dateRDV, formattedDate } = timerRDV()

    // console.log(formattedDate);
    



    return (
        <Box className="mt-6 mb-4 gap-7 grid 2xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
            <Box 
                className="flex flex-col gap-2 p-4 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
                <Box className="flex flex-row gap-3 items-center">
                    <CalendarMonthOutlinedIcon
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '6px',
                            backgroundColor: colors.secondary[500],
                        }}
                    />
                    <Box className="flex flex-col items-start">
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
                            }}
                        >
                            Total consultations
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: colors.blackAccent[100],
                            }}
                        >06</Typography>
                    </Box>
                </Box>
                <Typography 
                    variant="p"
                    sx={{
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
                    }}
                >sur les 30 derniers jours</Typography>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-4 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
                <Box className="flex flex-row gap-3 items-center">
                    <VideoCameraFrontOutlinedIcon
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '6px',
                            backgroundColor: colors.secondary[500],
                        }}
                    />
                    <Box className="flex flex-col items-start">
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
                            }}
                        >
                            Total téléconsultations
                        </Typography>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                color: colors.blackAccent[100],
                            }}
                        >21</Typography>
                    </Box>
                </Box>
                <Typography 
                    variant="p"
                    sx={{
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
                    }}
                >sur les 30 derniers jours</Typography>
            </Box>
             <Box 
                className="flex flex-col gap-2 p-4 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
                <Box className="flex flex-row gap-3 items-center">
                    <ScheduleOutlinedIcon
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '6px',
                            backgroundColor: colors.secondary[500],
                        }}
                    />
                    <Box className="flex flex-col items-start">
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
                            }}
                        >
                            Prochain rendez-vous
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: colors.blackAccent[100],
                            }}
                        >{formattedDate} </Typography>
                    </Box>
                </Box>
                <Typography 
                    variant="p"
                    sx={{
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600],
                    }}
                >
                    dans
                    <span className={`${dateRDV.month !== 0 ? 'inline' : 'hidden'}`}>  {dateRDV.month} mois</span>
                    <span className={`${dateRDV.days !== 0 ? 'inline' : 'hidden'}`}> {dateRDV.days} jours</span>
                    <span className={`${(dateRDV.hours !== 0  && dateRDV.month === 0) ? 'inline' : 'hidden'}`}> {dateRDV.hours} h</span>
                    <span className={`${(dateRDV.minutes !== 0 && dateRDV.days === 0) ? 'inline' : 'hidden'}`}> {dateRDV.minutes} min</span>
                    <span className={`${(dateRDV.seconds !== 0 && dateRDV.days === 0) ? 'inline' : 'hidden' }`}> {dateRDV.seconds} s</span>
                </Typography>
            </Box>
        </Box>
    )

}

export default IntroDashboard;