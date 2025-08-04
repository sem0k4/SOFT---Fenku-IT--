import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";


export default function IdentityPatient() {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box
            className={`rounded-lg my-8 h-fit pb-4 w-full`} 
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                display: 'flex',
                // boxShadow: `0px 0px 10px ${theme.palette.mode === 'dark' ? 'rgba(80, 90, 92, 0.4)' : 'rgba(0, 0, 0, 0.1)'} `,
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
                // border: `1px solid ${theme.palette.mode === 'dark' ? colors.blackAccent[500] : colors.blackAccent[800]}`,
                flexDirection: 'column',
                gap: '12px',
            }}
        >
            <img 
                src="/images/exemple_profile.webp" 
                alt="Fallou Ndiaye" 
                className="w-18 h-18 -mt-8 mx-auto object-cover rounded-full" 
            />
            <Box className="flex flex-col items-center gap-1">
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',

                    }}
                >Fallou Ndiaye</Typography>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 500,
                        fontSize: '14px',
                        color: colors.secondary[500]
                    }}
                >Patient</Typography>
            </Box>
            <Box className="grid grid-cols-2 gap-6 gap-y-4">
                <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            color: colors.secondary[400]
                        }}
                    >Age</Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 500,
                        }}
                    >34 ans</Typography>
                </Box>
                    <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            color: colors.secondary[400]
                        }}
                    >Poids</Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 500,
                        }}
                    >45 kg</Typography>
                </Box>
                    <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            color: colors.secondary[400]
                        }}
                    >Taille</Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 500,
                        }}
                    >195 cm</Typography>
                </Box>
                    <Box>
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 500,
                            color: colors.secondary[400]
                        }}
                    >Groupe sanguin</Typography>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 500,
                        }}
                    >O -</Typography>
                </Box>
            </Box>
        </Box>
    )
}