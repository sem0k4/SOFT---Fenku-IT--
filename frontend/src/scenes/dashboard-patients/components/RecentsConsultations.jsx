import { Link } from "react-router-dom";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const consultations = [
    {
        date: '13/06/2025',
        hour: '09:30',
        doctor: 'Dr Mbengue',
        type: 'presentielle',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
    {
        date: '01/09/2025',
        hour: '12:00',
        doctor: 'Dr Ngom',
        type: 'presentielle',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
    {
        date: '01/12/2025',
        hour: '08:00',
        doctor: 'Dr Ngom',
        type: 'en ligne',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
    {
        date: '01/10/2025',
        hour: '10:30',
        doctor: 'Dr Ngom',
        type: 'presentielle',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
]

export default function RecentsConsultations() {

    // recentsConsultations pour recuperer les trois dernieres consultations 
    // que nous devons trier d'abord en fonction de la date de consultation
    const recentsConsultations = consultations.slice(-3)

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            className={`rounded-lg md:overflow-x-scroll lg:w-[40%] md:w-1/2 w-full overflow-x-auto mb-8 p-4`} 
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
            {/* <Typography
                variant="h6"
                className="py-10"
                sx={{
                    fontWeight: 500,
                    color: colors.blackAccent[100]
                }}
            >
                Aucune rendez-vous pour le moment
            </Typography> */}
            <Box className="rounded-lg flex flex-col gap-2 w-full">
                {recentsConsultations.map((consultation, index) => (
                    <Box 
                        key={index}
                        className="flex flex-row w-full justify-between rounded-lg items-center p-3 xs:gap-8 gap-2 duration-300"
                        sx={{
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800],
                            '&:hover': {
                                backgroundColor: theme.palette.mode === 'dark' ? colors.secondary[800] : '#e4e4e490',
                            },
                        }}
                    >
                        <Box className="flex flex-row gap-2">
                            <Avatar
                                className="text-black relative z-0 shadow-sm font-semibold bg-transparent border border-black"
                                alt="Dr Mbengue"
                                src="/images/exemple_docteur.webp"
                            />
                            <Typography
                                variant="h4"
                                className="flex flex-col text-left gap-0"
                                fontSize="12px"
                            >
                                <span style={{ fontSize: '14px' }} className="font-semibold md:text-lg">{consultation.doctor}</span>
                                <span 
                                    className="font-semibold" 
                                    style={{ 
                                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],
                                    }}
                                >{consultation.date} - {consultation.hour}</span>
                            </Typography>
                        </Box>
                        <Typography 
                            sx={{
                                fontWeight: 500,
                                color: theme.palette.mode === 'dark' ? colors.secondary[400] : colors.secondary[500],
                                fontSize: '0.7rem',
                                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#e4e4e470',
                            }}
                            className="p-2 h-fit w-20 rounded-lg"
                        >
                            {consultation.type}
                        </Typography>
                    </Box>
                ))}
            </Box>
            <Box className="flex">
                <Link
                    className="font-semibold p-2 px-4 rounded-md"
                    style={{
                        textDecoration: 'none',
                        width: '100%',
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[800] : '#fcfcfc',
                        backgroundColor: colors.secondary[500], 
                        // "&:hover": {
                        //     backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[900],
                        // }
                        '&:hover': {
                            backgroundColor: theme.palette.mode === 'dark' ? colors.secondary[800] : '#e4e4e490',
                        },
                    }}
                    to='/dashboard-patient/consultation'
                >Voir plus de détail</Link>
            </Box>
        </Box>
    );
}