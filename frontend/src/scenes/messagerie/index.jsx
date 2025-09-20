import { Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import SidebarChat from "./components/SidebarChat";
import DetailMessage from "./components/DetailMessage";

const Messagerie = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box 
            className="rounded-md flex md:flex-row"
            sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[600] : '#fcfcfc', 
                boxShadow: `0px 0px 10px ${theme.palette.mode === 'light' && 'rgba(0, 0, 0, 0.1)'} `,
            }}
        >
            <SidebarChat />
            <DetailMessage />
        </Box>
    )
}

export default Messagerie;