import { Avatar, Box, Typography, useTheme } from "@mui/material"
import { tokens } from "../../../theme";


const DetailMessage = ({ id, name, urlAvatar, lastConnect, isFavoris, valueSearch }) => {

    const theme  = useTheme();
    const colors = tokens(theme.palette.mode);
    

    return(
        <div>
            <Box className="min-[900px]:w-w-2/3 min-[900px]:flex hidden flex-row gap-3 items-center py-3 px-8 rounded-md duration-200">
                <Avatar
                    className="shadow-sm text-white font-semibold"
                    alt={name}
                    src={urlAvatar}
                    sx={{ width: 36, height: 36, marginLeft: '-15px' }}
                />
                <Box>
                    {/* <Box className="flex flex-row justify-between pr-3"> */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 600,
                                textAlign: 'left',
                                color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600]
                            }}
                        >
                            {/* {name} */}
                            Docteur Ndoye
                        </Typography>
                    {/* </Box> */}
                    <Typography 
                        variant="p"
                        className="line-clamp-1"
                        sx={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                            textAlign: 'left',
                        }}
                    >
                        {lastConnect}
                    </Typography>
                </Box>
            </Box>
        </div>
    )
}

export default DetailMessage;