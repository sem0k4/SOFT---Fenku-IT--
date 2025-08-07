import { Link } from "react-router-dom";
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
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem suscipit, iure neque explicabo velit perferendis repellendus iste dolores eum praesentium.'
    },
]

export default function RecentsConsultations() {

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
        >
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 'bold',
                    textAlign: 'left',
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
            </Box>
        </Box>
    );
}