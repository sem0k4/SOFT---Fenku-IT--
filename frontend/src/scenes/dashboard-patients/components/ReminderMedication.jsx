import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import { Link } from "react-router-dom";



const reminderMedications = [
    {
        name: 'Amoxicilline',
        dose: '500',
        unite: 'mg',
        description: '2 fois par jour',
        icon: <FolderSharedOutlinedIcon 
                sx={{ 
                    backgroundColor: '#cceaef', 
                    color: '#0096b0', 
                    padding: '4px',
                    fontSize: '30px',
                    borderRadius: '50%',
                }} 
            />
    },
    {
        name: 'Paracétamol',
        dose: '1000',
        unite: 'mg',
        description: '3 fois par jour',
        icon: <FolderSharedOutlinedIcon 
                sx={{ 
                    backgroundColor: '#cceaef', 
                    color: '#0096b0', 
                    padding: '4px',
                    fontSize: '30px',
                    borderRadius: '50%',
                }} 
            />
    },
    {
        name: 'Amifer',
        dose: '10',
        unite: 'ml',
        description: '1 petit cuillère par jour',
        icon: <FolderSharedOutlinedIcon 
                sx={{ 
                    backgroundColor: '#cceaef', 
                    color: '#0096b0', 
                    padding: '4px',
                    fontSize: '30px',
                    borderRadius: '50%',
                }} 
            />
    },
]


const ReminderMedication = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    

    return(
        <Box
            className={`rounded-lg md:overflow-x-scroll lg:w-[40%] md:w-1/2 w-full overflow-x-auto p-4`} 
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                display: 'flex',
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                flexDirection: 'column',
                gap: '10px',
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'left',
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[500],
                    }}
                >
                    Rappels prise de médicaments
                </Typography>
                <Typography
                    variant="p"
                    sx={{
                        textAlign: 'left',
                        marginBottom: '12px',
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                    }}
                >
                    Planning des prises de médicaments
                </Typography>
            </Box>
            {/* Cas où le patients n'a pas fait des test de ses données santé */}
            {/* <Typography
                variant="h6"
                className="py-20"
                sx={{
                    fontWeight: 500,
                    color: colors.blackAccent[100]
                }}
            >
                Pas de médicaments prescrits pour l'instant
            </Typography> */}
            <Box className="rounded-lg flex flex-col gap-3 w-full">
                {reminderMedications.map((reminderMedication, index) => (
                    <Box 
                        key={index}
                        className="flex flex-row w-full gap-3 rounded-lg items-center p-3 duration-300"
                        sx={{
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                        }}
                    >
                        {/* <Box className="flex flex-row gap-2"> */}
                            
                            {reminderMedication.icon}
                            <Typography
                                variant="p"
                                className="flex flex-col text-left gap-0"
                                fontSize="12px"
                            >
                                <span 
                                    className="font-semibold"
                                    style={{ 
                                        fontSize: '15px', 
                                    }} 
                                >
                                    {reminderMedication.name}
                                </span>
                                <span 
                                    style={{ 
                                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],
                                        fontWeight: 500,
                                    }}
                                >{reminderMedication.dose} {reminderMedication.unite} - {reminderMedication.description}</span>
                            </Typography>
                        {/* </Box> */}
                    </Box>
                ))}
                <Link
                    className="font-semibold p-2 px-4 rounded-md hover:opacity-70 active:opacity-70 duration-200"
                    style={{
                        textDecoration: 'none',
                        width: '100%',
                        color: '#fcfcfc',
                        backgroundColor: colors.secondary[500], 
                    }}
                    to='/dashboard-patient/documents'
                >Voir les prescriptions</Link>
            </Box>
        </Box>
    )
}

export default ReminderMedication;