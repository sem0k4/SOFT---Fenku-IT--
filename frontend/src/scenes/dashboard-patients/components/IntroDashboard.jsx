import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined'
import { tokens } from "../../../theme";
import { Link } from "react-router-dom";

const IntroDashboard = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // console.log(formattedDate);


    return (
        <Box className="mt-6 mb-4 gap-3 grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    borderRadius: '0.5rem',
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Prochain rendez-vous
                    </Typography>
                    <CalendarMonthOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500],
                        }}
                    >
                        24 Août
                    </Typography>
                    <Typography
                        variant="h6"
                        className="text-left"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >10:30 avec Dr Mbengue</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='rdv'
               >
                    <span>Voir plus de détail</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Médicaments
                    </Typography>
                    <CalendarMonthOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500]
                        }}
                    >
                        4 actives
                    </Typography>
                    <Typography
                        className="text-left"
                        variant="h6"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >prochain dans 6 heures</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='#'
               >
                    <span>Voir les prescriptions</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Total consultations
                    </Typography>
                    <ContactsOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h3"
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500], 
                        }}
                    >
                        13
                    </Typography>
                    <Typography
                        variant="h6"
                        className="text-left"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >sur les 30 derniers jours</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='consultation'
               >
                    <span>Voir les consultations</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
            <Box 
                className="flex flex-col gap-2 p-3 rounded-lg justify-start items-start"
                sx={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                    boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                }}    
            >
               <Box 
                    sx={{ 
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '30px',
                    }}
               >
                    <Typography 
                        variant="h6" 
                        className="mt-1 text-left" 
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >
                        Résultats test
                    </Typography>
                    <CalendarMonthOutlinedIcon 
                        sx={{ 
                            padding: '4px',
                            fontSize: '30px',
                            borderRadius: '50%',
                            color: colors.secondary[500], 
                            backgroundColor: colors.secondary[900]
                        }} 
                    />
               </Box>
               <Box>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 'bold', 
                            textAlign: 'left', 
                            marginBottom: '-4px',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500], 
                        }}
                    >
                        2 nouveaux
                    </Typography>
                    <Typography
                        variant="h6"
                        className="text-left"
                        sx={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],}}
                    >analyse sanguine du 12 Aout</Typography>
               </Box>
               <span className="w-full border-b mt-2" style={{ color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800] }}></span>
               <Link
                    className="group transition-all duration-300"
                    style={{ 
                        color: colors.secondary[500],
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                    to='#'
               >
                    <span>Voir les détail</span>
                    <ChevronRightOutlinedIcon className="group-hover:translate-x-1 duration-300" sx={{ marginBottom: '1px' }} />
               </Link>
            </Box>
        </Box>
    )

}

export default IntroDashboard;