import { Outlet } from "react-router-dom"; 
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
import SidebarDesktop from "../../scenes/global/SidebarDesktop";
import Topbar from "../../scenes/global/Topbar";
<<<<<<< HEAD
import Chatbot from "../landing/Home/Chatbot";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
=======
import SidebarDashboard from "../../scenes/global/Sidebar";
import Topbar from "../../scenes/global/Topbar";
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
=======
import Chatbot from "../landing/Home/Chatbot";
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
=======
>>>>>>> 4df3e6e (Revert "ajout de l'icone du chatbot et quelque modif dans le dashboard patient")
=======
import Chatbot from "../landing/Home/Chatbot";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)


const DashboardLayout = () => {

<<<<<<< HEAD
<<<<<<< HEAD
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    return (
        <div className="flex flex-row">
            <SidebarDesktop /> 
<<<<<<< HEAD
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

=======
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)

    return (
        <div className="flex flex-row">
            <SidebarDashboard /> 
=======
>>>>>>> 2f76659 (ajout de donnees vitales et d'autres cartes dans le dashboard patient)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> a5eee99 (retouch configuration sidebar dashboard patient)
=======
            <Chatbot />
>>>>>>> ad81247 (ajout de l'icone du chatbot et quelque modif dans le dashboard patient)
=======
>>>>>>> 4df3e6e (Revert "ajout de l'icone du chatbot et quelque modif dans le dashboard patient")
=======
            {/* <Chatbot /> */}
>>>>>>> 8e642a7 (changement de quelques elements du dashboard patient)
        </div>
    )   
}

export default DashboardLayout;