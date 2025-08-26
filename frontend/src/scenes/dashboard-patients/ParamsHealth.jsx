import { Box, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { tokens } from "../../theme";
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';



const paramsHealth = [
    {
        name: 'Température corporelle',
        description: 'Température moyenne',
        averageData: '27',
        realData: '26.8',
        unite: '° C',
        icon: <FolderSharedOutlinedIcon />
    },
    {
        name: 'Pression artérielle',
        description: 'Valeurs moyenne',
        averageData: '120/80',
        realData: '118/78',
        unite: 'mmHg',
        icon: <FolderSharedOutlinedIcon />
    },
    {
        name: 'Taux de sucre',
        description: 'Valeurs moyenne',
        averageData: '70-140',
        realData: '98',
        unite: 'mg/dL',
        icon: <FolderSharedOutlinedIcon />
    },
]


const ParamsHealth = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode);
    

    return(
        <Box
            className={`rounded-lg md:overflow-x-scroll overflow-x-auto p-4`} 
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                display: 'flex',
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                flexDirection: 'column',
                gap: '12px',
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
                    Paramètres de santé
                </Typography>
                <Typography
                    variant="p"
                    sx={{
                        textAlign: 'left',
                        marginBottom: '12px',
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                    }}
                >
                    Résumé de vos paramètres de santé prises
                </Typography>
            </Box>
            {/* Cas où le patients n'a pas fait des test de ses données santé */}
            {/* <Typography
                variant="h6"
                className="py-10"
                sx={{
                    fontWeight: 500,
                    color: colors.blackAccent[100]
                }}
            >
                Pas de données enregistrées pour l'instant
            </Typography> */}
            <Box className="rounded-lg flex flex-col gap-2 w-full">
                {paramsHealth.map((paramHealth, index) => (
                    <Box 
                        key={index}
                        className="flex flex-row w-full gap-2 justify-between rounded-lg items-center p-3 duration-300"
                        sx={{
                            border: '1px solid',
                            borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[800],
                        }}
                    >
                        <Box className="flex flex-row gap-2">
                            
                            {paramHealth.icon}
                            <Typography
                                variant="p"
                                className="flex flex-col text-left gap-0"
                                fontSize="12px"
                            >
                                <span 
                                    className="font-semibold"
                                    style={{ 
                                        fontSize: '15px', 
                                        color: theme.palette.mode === 'dark' ? colors.secondary[800] : colors.blackAccent[600]
                                    }} 
                                >
                                    {paramHealth.name}
                                </span>
                                <span 
                                    style={{ 
                                        color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[700],
                                        fontWeight: 500,
                                    }}
                                >{paramHealth.description} : {paramHealth.averageData} {paramHealth.unite}</span>
                            </Typography>
                        </Box>
                        <Typography 
                            sx={{
                                fontWeight: 'bold',
                                color: colors.secondary[500],
                                fontSize: '1.2rem',
                            }}
                            className="p-2 h-fit rounded-lg"
                        >
                            {paramHealth.realData} {paramHealth.unite}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default ParamsHealth;