import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";
const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return <>
        <div className="d-flex">
            <Sidebar />
            <div className=" text-light min-vh-100 w-100">
                <Topbar />
                {<Outlet />}
            </div>
        </div>
    </>
}
export default Dashboard;