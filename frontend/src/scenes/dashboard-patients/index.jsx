import SidebarDashboard from "../global/Sidebar"; 
import Topbar from "../global/Topbar";


const Dashboard = () => {
    return (
        <div className="flex flex-row">
            <SidebarDashboard /> 
            <Topbar />
        </div>
    )   
}

export default Dashboard;