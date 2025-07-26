import { Outlet } from "react-router-dom"; 
<<<<<<< HEAD
import SidebarDesktop from "../../scenes/global/SidebarDesktop";
import Topbar from "../../scenes/global/Topbar";
import Chatbot from "../landing/Home/Chatbot";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
=======
import SidebarDashboard from "../../scenes/global/Sidebar";
import Topbar from "../../scenes/global/Topbar";
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)


const DashboardLayout = () => {

<<<<<<< HEAD
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
            {/* <Chatbot /> */}
=======
    // const [isSidebar, setIsSidebar] = useState(true);


    return (
        <div className="flex flex-row">
            <SidebarDashboard /> 
            <div className="md:relative absolute flex flex-col gap-8 w-full p-4 md:ml-0 ml-24">
            <Topbar />
                <main>
                    <Outlet />
                </main>
            </div>
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
        </div>
    )   
}

export default DashboardLayout;