import { Outlet } from "react-router-dom"; 
import SidebarDesktop from "../../scenes/global/SidebarDesktop";
import Topbar from "../../scenes/global/Topbar";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";


const DashboardLayout = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return (
        <div className="flex flex-row">
            <SidebarDesktop /> 
            <div 
                className="md:relative absolute flex flex-col w-full"
                style={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[700] : '#fcfcfc80', 
                }}
            >
                <Topbar />
                <main className="p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    )   
}

export default DashboardLayout;
