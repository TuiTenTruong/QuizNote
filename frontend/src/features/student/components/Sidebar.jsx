import { NavLink } from "react-router-dom";
import { FaHome, FaBook, FaChartBar, FaWallet, FaCog } from "react-icons/fa";
import { NavbarBrand } from "react-bootstrap";
import "./Sidebar.scss";

const Sidebar = ({ isOpen, onClose }) => {
    return (
        <div
            className={`student-sidebar d-flex flex-column p-3 text-light ${isOpen ? "open" : ""}`}
        >
            {/* Brand Logo */}
            <div className="mb-4 text-center">
                <NavbarBrand
                    as={NavLink}
                    to="/student/dashboard"
                    className="text-gradient fw-bold fs-4"
                    onClick={onClose}
                >
                    QuizNote
                </NavbarBrand>
            </div>

            {/* Navigation */}
            <nav className="flex-grow-1">
                <NavLink
                    to="/student/dashboard"
                    onClick={onClose}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <FaHome className="me-2" /> Dashboard
                </NavLink>

                <NavLink
                    to="/student/quizzes"
                    onClick={onClose}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <FaBook className="me-2" /> My Quizzes
                </NavLink>

                <NavLink
                    to="/student/analytics"
                    onClick={onClose}
                    className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                >
                    <FaChartBar className="me-2" /> Analytics
                </NavLink>
            </nav>

            <hr className="border-secondary my-3" />

            {/* Settings */}
            <NavLink
                to="/student/settings"
                onClick={onClose}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            >
                <FaCog className="me-2" /> Settings
            </NavLink>
        </div>
    );
};
export default Sidebar;
