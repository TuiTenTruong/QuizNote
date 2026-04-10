import { Outlet } from "react-router-dom";
import { ReactElement, useState } from "react";
import { FaBars } from "react-icons/fa";
import "../admin/components/AdminAppbar.scss";
import AdminSidebar from "./components/Sidebar";
import { useDashboard } from "../../hooks/useDashboard";

const AdminDashboardPage = (): ReactElement => {
    const { isSidebarOpen, toggleSidebar } = useDashboard();

    return (
        <section className="container-fluid p-0 admin_layout bg-black text-light">
            <div className="row g-0">
                <AdminSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <main className="main-content text-light min-vh-100">
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
                </main>
            </div>
        </section>
    );
}

export default AdminDashboardPage;