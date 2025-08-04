import { Link } from "react-router-dom";
<<<<<<< HEAD
import { Avatar, Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useMemo } from "react";

const consultations = [
    {
        id: 1,
        date: '13/06/2025',
        hour: '09:30',
        doctor: 'Dr Mbengue',
        specialty: 'Cardiologue',
        type: 'presentielle',
        avatar: '/images/exemple_docteur.webp',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
    {
        id: 2,
        date: '01/09/2025',
        hour: '12:00',
        doctor: 'Dr Ngom',
        specialty: 'Neurologue',
        type: 'presentielle',
        avatar: '/images/exemple_docteur.webp',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
    {
        id: 3,
        date: '01/12/2025',
        hour: '08:00',
        doctor: 'Dr Ngom',
        specialty: 'Neurologue',
        type: 'en ligne',
        avatar: '/images/exemple_docteur.webp',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
    {
        id: 4,
        date: '01/10/2025',
        hour: '10:30',
        doctor: 'Dr Ngom',
        specialty: 'Neurologue',
        type: 'presentielle',
        avatar: '/images/exemple_docteur.webp',
=======
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

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
        type: 'en ligne',
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
]

export default function RecentsConsultations() {
<<<<<<< HEAD
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    
    // Récupérer les trois dernières consultations et les trier par date
    // Utilisation de useMemo pour éviter des calculs inutiles lors des re-renders
    const recentsConsultations = useMemo(() => {
        // Ici, on pourrait ajouter une logique de tri par date si nécessaire
        // Par exemple: consultations.sort((a, b) => new Date(a.date) - new Date(b.date))
        return consultations.slice(-3);
    }, []);
    
    // Styles communs extraits pour une meilleure maintenabilité
    const containerStyle = {
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc',
        display: 'flex',
        boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
        flexDirection: 'column',
        gap: '12px',
    };
    
    const consultationItemStyle = {
        '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? colors.secondary[800] : '#e4e4e490',
        },
    };
    
    const consultationTypeStyle = {
        fontWeight: 500,
        color: theme.palette.mode === 'dark' ? colors.secondary[400] : colors.secondary[500],
        fontSize: '0.7rem',
        backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[500] : '#e4e4e470',
    };
    
    const linkStyle = {
        textDecoration: 'none',
        width: 'fit-content',
        color: theme.palette.mode === 'dark' ? colors.blackAccent[800] : '#fcfcfc',
        backgroundColor: colors.secondary[500],
    };

    // Composant pour afficher une consultation individuelle
    const ConsultationItem = ({ consultation }) => (
        <Box 
            key={consultation.id}
            className="flex flex-row w-full justify-between rounded-lg items-center p-3 xs:gap-8 gap-2 duration-300"
            sx={consultationItemStyle}
        >
            <Box className="flex flex-row gap-2">
                <Avatar
                    alt={consultation.doctor}
                    src={consultation.avatar}
                />
                <Typography
                    variant="p"
                    className="flex flex-col text-left gap-0"
                    fontSize="12px"
                >
                    <span style={{ fontSize: '14px' }} className="font-semibold md:text-lg">{consultation.doctor}</span>
                    <span className="font-semibold" style={{ color: colors.secondary[500]}}>{consultation.specialty}</span>
                </Typography>
            </Box>
            <Typography 
                className="flex flex-col gap-1 mt-1 justify-start items-start" 
                variant="p"
                fontSize="12px"
            >
                <span className="font-semibold">{consultation.date}</span>
                <span>{consultation.hour}</span>
            </Typography>
            <Typography 
                sx={consultationTypeStyle}
                className="p-2 h-fit w-20 rounded-lg"
            >
                {consultation.type}
            </Typography>
        </Box>
    );

    return (
        <Box
            className="rounded-lg md:overflow-x-scroll overflow-x-auto mb-8 p-4" 
            sx={containerStyle}
=======

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            className={`rounded-lg mb-8 p-6 bg-red-500`} 
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                display: 'flex',
                // boxShadow: `0px 0px 10px ${theme.palette.mode === 'dark' ? 'rgba(80, 90, 92, 0.4)' : 'rgba(0, 0, 0, 0.1)'} `,
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                flexDirection: 'column',
                gap: '12px',
            }}
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
<<<<<<< HEAD
                    color: colors.secondary[500],
                }}
            >
                Consultations à venir
            </Typography>
            
            {recentsConsultations.length === 0 ? (
                <Typography
                    variant="h6"
                    className="py-10"
                    sx={{
                        fontWeight: 500,
                        color: colors.blackAccent[100]
                    }}
                >
                    Aucune consultation récente
                </Typography>
            ) : (
                <Box className="rounded-lg flex flex-col w-full">
                    {recentsConsultations.map((consultation) => (
                        <ConsultationItem 
                            key={consultation.id} 
                            consultation={consultation} 
                        />
                    ))}
                </Box>
            )}
            
            <Box className="flex">
                <Link
                    className="font-semibold p-2 px-4 rounded-md"
                    style={linkStyle}
                    to='/dashboard-patient/consultation'
                >
                    Voir plus
                </Link>
=======
                    // marginTop: '20px',
                    color: colors.secondary[500]
                }}
            >
                Vos derniers Consultations
            </Typography>
            {/* <Typography
                variant="h6"
                className="py-10"
                sx={{
                    fontWeight: 500,
                    color: colors.blackAccent[100]
                }}
            >
                Aucune consultation récente
            </Typography> */}
            <Box className="md:p-3 rounded-lg flex flex-col gap-5">
                {consultations.map((consultation, index) => (
                    <Box 
                        key={index}
                        className="flex flex-row gap-4 pb-4 justify-between"
                        sx={{
                            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]}`
                        }}
                    >
                        <Typography 
                            className="flex flex-col gap-1 mt-1 justify-start items-start" 
                            variant="h6"
                            >
                            <span className="font-semibold">{consultation.date}</span>
                            <span>{consultation.hour}</span>
                        </Typography>
                        <Box className="flex flex-col gap-2">
                            <Box className=" flex flex-row justify-between items-center">
                                <Typography className="flex flex-col text-left gap-0">
                                    <span className="font-semibold md:text-lg">{consultation.doctor}</span>
                                    {/* <span className="font-semibold" style={{ color: colors.secondary[500]}}>Cardiologue</span> */}
                                </Typography>
                                <Typography 
                                    sx={{
                                        fontWeight: 500,
                                        color: colors.secondary[400],
                                        fontSize: '0.7rem',
                                        backgroundColor: theme.palette.mode === 'dark' ? colors.primary[500] : '#e4e4e4',
                                    }}
                                    className="p-2 rounded-lg"
                                >
                                    {consultation.type}
                                </Typography>
                            </Box>
                            <Typography className="text-left line-clamp-1">
                                {consultation.description}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box className="flex w-full justify-end">
                <Link
                    className="font-semibold p-2 px-4 rounded-md hover:bg-red-400"
                    style={{
                        textDecoration: 'none',
                        width: 'fit-content',
                        color: theme.palette.mode === 'dark' ? colors.secondary[700] : colors.secondary[400],
                        backgroundColor: theme.palette.mode === 'dark' ? colors.secondary[400] : '#e4e4e4',
                        // ":hover": {
                        //     backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[900],
                        // }
                    }}
                    to='/dashboard-patient/consultation'
                >Voir plus</Link>
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
            </Box>
        </Box>
    );
}