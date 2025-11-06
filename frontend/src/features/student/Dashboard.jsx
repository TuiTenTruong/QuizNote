import Sidebar from "./components/Sidebar";
import { useState } from "react";
import Topbar from "./components/Topbar";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="container-fluid p-0">
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
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;