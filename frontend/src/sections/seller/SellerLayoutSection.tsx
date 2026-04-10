import { Outlet } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import SellerSidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import styles from "./scss/SellerAppbar.module.scss";

const SellerLayoutSection = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`container-fluid p-0 ${styles.sellerLayout}`}>
            <div className="row g-0">
                <SellerSidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

                <div className="main-content text-light min-vh-100">
                    <div className="d-md-none p-3 bg-dark">
                        <button
                            className="btn btn-link text-light"
                            onClick={toggleSidebar}
                            style={{ fontSize: "1.5rem" }}
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
};

export default SellerLayoutSection;
