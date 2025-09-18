import { Link } from "react-router-dom";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { format, compareDesc }  from 'date-fns';
import { fr } from 'date-fns/locale';


export default function RecentsConsultations({ recentsRDV }) {
    
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const filterRDV = recentsRDV.sort(compareDesc);
    
    const danger = {
        fontWeight: 500,
        color: 'red',
        fontSize: '0.7rem',
        backgroundColor: '#F5492735',
    }
    const success = {
        fontWeight: 500,
        color: 'green',
        fontSize: '0.7rem',
        backgroundColor: '#33EB5E35',
    }
    
    const waiting = {
        fontWeight: 500,
        color: '#2292FC',
        fontSize: '0.7rem',
        backgroundColor: '#32D0EC30',
    }

    console.log(filterRDV);

    
 
    return (
        <Box
            className={`rounded-lg md:overflow-x-scroll lg:w-[40%] md:w-1/2 w-full overflow-x-auto p-4`} 
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                display: 'flex',
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
                    marginBottom: '12px',
                    color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500],
                }}
            >
                Rendez-vous à venir
            </Typography>
            {/* Cas où le patients n'a pas de rendez-vous à venir */}
            {recentsRDV.length === 0 && 
            <Typography
                variant="h5"
                className="py-28"
                sx={{
                    fontWeight: 500,
                    color: colors.blackAccent[100]
                }}
            >
                Aucune rendez-vous pour le moment
            </Typography>}
            <Box className="rounded-lg flex flex-col gap-2 w-full">
                {recentsRDV.map((recentRDV, index) => (
                    <Box 
                        key={index}
                        className="flex flex-row w-full justify-between rounded-lg items-center p-3 xs:gap-8 gap-2 duration-300"
                        sx={{
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? colors.secondary[800] : '#e4e4e490',
                            },
                        }}
                    >
                        <Box className="flex flex-row gap-2">
                            <Avatar
                                className="text-black relative z-0 shadow-sm font-semibold bg-transparent border border-black"
                                alt={`${recentRDV.medecin.prenom} ${recentRDV.medecin.nom}`}
                                src="/images/exemple_docteur.webp"
                            />
                            <Typography
                                variant="h4"
                                className="flex flex-col text-left gap-0"
                                fontSize="12px"
                            >
                                <span style={{ fontSize: '14px' }} className="font-semibold md:text-lg">{recentRDV.medecin.prenom} {recentRDV.medecin.nom}</span>
                                <span 
                                    style={{ 
                                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],
                                    }}
                                >
                                    {format(recentRDV.date, "dd MMMM yyyy '-' HH:mm", { locale: fr})}
                                </span>
                            </Typography>
                        </Box>
                        <Typography 
                            sx={
                                recentRDV.statut === 'termine' && success || 
                                recentRDV.statut === 'annule' && danger || 
                                recentRDV.statut === 'planifie' && waiting
                            }
                            className="p-2 h-fit w-20 rounded-lg"
                        >
                            {recentRDV.statut}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box className="flex">
                {recentsRDV.length !== 0 && 
                <Link
                    className="font-semibold p-2 px-4 rounded-md hover:opacity-70 active:opacity-70 duration-200"
                    style={{
                        textDecoration: 'none',
                        width: '100%',
                        color: '#fcfcfc',
                        backgroundColor: colors.secondary[500], 
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? colors.secondary[800] : '#e4e4e490',
                        },
                    }}
                    to='/dashboard-patient/consultation'
                >Voir plus de détail</Link>}
            </Box>
        </Box>
    );
}