import { Outlet } from "react-router-dom"; 
import SidebarDashboard from "../../scenes/global/Sidebar";
import Topbar from "../../scenes/global/Topbar";


const DashboardLayout = () => {

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
        </div>
    )   
}

export default DashboardLayout;