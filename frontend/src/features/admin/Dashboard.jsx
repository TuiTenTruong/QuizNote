import { Outlet } from "react-router-dom";
import Sidebar from "../admin/components/Sidebar";
import Topbar from "../admin/components/Topbar";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import "../admin/components/AdminAppbar.scss";



const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="container-fluid p-0 admin_layout bg-black text-light">
            <div className="row g-0">
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <div className="main-content text-light min-vh-100">
                    {/* Mobile hamburger menu */}
                    <div className="d-md-none p-3 bg-dark">
                        <button
                            className="btn btn-link text-light"
                            onClick={toggleSidebar}
                            style={{ fontSize: '1.5rem' }}
                        >
                            <FaBars />
                        </button>
                    </div>
                    <Topbar />
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;