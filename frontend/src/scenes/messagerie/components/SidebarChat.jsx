import { Avatar, Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { IoSearchOutline } from "react-icons/io5";
import TabChat from "./TabChat";


const SidebarChat = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    

    return (
        <Box 
            className="min-[900px]:w-[30%] w-full py-4 pt-3 h-screen overflow-hidden"
            sx={{
                borderRight: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
            }}
        >
            <div className="flex flex-col gap-4">
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'left',
                        padding: '0 1rem',
                    }}
                >Messages</Typography>
                <Box 
                    className="flex flex-row justify-between group cursor-text rounded-md p-2.5 ml-4 mr-4"
                    sx={{
                        border: '1px solid',
                        borderColor: theme.palette.mode === 'dark' ? colors.blackAccent[400] : colors.blackAccent[900],
                    }}
                >
                    <input
                        className={`focus:outline-0`}
                        type="text"
                        placeholder="Rechercher une conversation"
                    />
                    <button>
                        <IoSearchOutline className="text-xl" />
                    </button>
                </Box>
                <TabChat />
            </div>
        </Box>
    )
}

export default SidebarChat;