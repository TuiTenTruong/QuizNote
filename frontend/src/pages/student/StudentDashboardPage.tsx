import Sidebar from "./components/Sidebar";
import type { ReactElement } from "react";
import { Outlet } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./components/StudentAppbar.scss";
import { useDashboard } from "../../hooks/useDashboard";

const StudentDashboardPage = (): ReactElement => {
    const { isSidebarOpen, toggleSidebar } = useDashboard();

    return (
        <section className="container-fluid p-0 student_layout">
            <div className="row g-0">
                <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="main-content text-light min-vh-100">
                    <div className="d-md-none p-3 bg-dark">
                        <button
                            className="btn btn-link text-light"
                            onClick={toggleSidebar}
                            aria-label="Mo menu sidebar"
                            style={{ fontSize: '1.5rem' }}
                        >
                            <FaBars />
                        </button>
                    </div>
                    <Outlet />
                </main>
            </div>
        </section>
    );
};

export default StudentDashboardPage;