import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";


const Message = ({ id, name, urlAvatar, content, date, selected}) => {

    const theme  = useTheme();
    const colors = tokens(theme.palette.mode);

    return(
        <button 
            key={id} 
            className={`w-full ${selected && 'bg-black/10'} flex flex-row gap-3 items-center py-3 px-8 rounded-md duration-200 hover:bg-black/10 active:bg-black/10`}
        >
            <Avatar
                className="shadow-sm text-white font-semibold"
                alt={name}
                src={urlAvatar}
                sx={{ width: 36, height: 36, marginLeft: '-15px' }}
            />
            <Box>
                <Box className="flex flex-row justify-between pr-3">
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 600,
                            textAlign: 'left',
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600]
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography 
                        variant="p"
                        className="line-clamp-1"
                        sx={{
                            color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                            // textAlign: 'left',
                        }}
                    >{date}</Typography>
                </Box>
                <Typography 
                    variant="p"
                    className="line-clamp-1"
                    sx={{
                        color: theme.palette.mode === 'dark' ? colors.blackAccent[100] : colors.blackAccent[600],
                        textAlign: 'left',
                    }}
                >
                    {content}
                </Typography>
            </Box>
        </button>
    )
}

export default Message;