import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import MonitorWeightTwoToneIcon from '@mui/icons-material/MonitorWeightTwoTone';
import HeightOutlinedIcon from '@mui/icons-material/HeightOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';


export default function DatasVitals() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <div 
            style={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
            }} 
            className="p-4 mb-4 rounded-lg flex flex-col gap-3"
        >
            <Typography
                variant="h5"
                sx={{ 
                    fontWeight: 600, 
                    width: '100%', 
                    textAlign: 'left',
                    borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                }}
                className="border-b pb-2"
            >
                Données vitales
            </Typography>
            <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-3">
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                    }}
                >
                    <MonitorWeightTwoToneIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Poids</Typography>
                        <Typography sx={{ fontWeight: 400 }} variant="p">
                            <span className="font-semibold" style={{ 
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100]
                            }}>95</span> Kg
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]
                    }}
                >
                    <HeightOutlinedIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Taille</Typography>
                        <Typography sx={{ fontWeight: 400 }} variant="p">
                            <span className="font-semibold" style={{ 
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100]
                            }}>189</span> cm
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]
                    }}
                >
                    <BloodtypeOutlinedIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Groupe sanguin</Typography>
                        <Typography 
                            sx={{ 
                                fontWeight: 600,
                                textAlign: 'left',
                                fontSize: '15px',
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100],
                            }} 
                            variant="p"
                        >
                            O -
                        </Typography>
                    </div>
                </div>
                <div 
                    className="flex flex-row gap-2 p-2 rounded-lg"
                    style={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900]
                    }}
                >
                    <BloodtypeOutlinedIcon 
                        sx={{
                            color: '#fcfcfc',
                            fontSize: 40,
                            borderRadius: '50%',
                            padding: '5px',
                            backgroundColor: colors.secondary[500],
                        }} 
                    />
                    <div
                        className="flex flex-col"
                        style={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[200] : colors.blackAccent[600]
                        }}
                    >
                        <Typography 
                            sx={{ 
                                fontWeight: 400, 
                            }} 
                            variant="h5"
                        >Groupe sanguin</Typography>
                        <Typography 
                            sx={{ 
                                fontWeight: 600,
                                textAlign: 'left',
                                fontSize: '15px',
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[100],
                            }} 
                            variant="p"
                        >
                            O -
                        </Typography>
                    </div>
                </div>
            </div>
        </div>
    )
}