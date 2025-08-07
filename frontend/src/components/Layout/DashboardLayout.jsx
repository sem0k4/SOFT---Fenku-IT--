import { Outlet } from "react-router-dom"; 
import SidebarDashboard from "../../scenes/global/Sidebar";
import Topbar from "../../scenes/global/Topbar";
import Chatbot from "../landing/Home/Chatbot";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";


const DashboardLayout = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return (
        <div className="flex flex-row">
            <SidebarDashboard /> 
            <div 
                className="md:relative absolute flex flex-col w-full h-full"
                style={{
                    backgroundColor: theme.palette.mode === 'dark' ? colors.blackAccent[700] : '#fcfcfc80', 
                }}
            >
                <Topbar />
                <main className=" md:ml-0 ml-20 p-4">
                    <Outlet />
                </main>
            </div>
            {/* <Chatbot /> */}
        </div>
    )   
}

export default DashboardLayout;