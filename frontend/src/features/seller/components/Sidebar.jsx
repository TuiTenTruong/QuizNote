import { Nav, NavbarBrand } from "react-bootstrap";
// import { FaHome, FaBook, FaCalendarAlt, FaUserGraduate, FaCog } from "react-icons/fa";
import { FaHome, FaBook, FaShoppingCart, FaChartLine, FaWallet, FaCog } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import "./Appbar.scss";

const Sidebar = () => {
    return (
        <div className="sidebar d-flex flex-column p-3">
            <div className="brand mb-4 text-center">
                <NavbarBrand as={Link} to="/">
                    <h4 className="text-gradient fw-bold">QuizNote</h4></NavbarBrand>
            </div>
            <Nav className="flex-column justify-content-center text-center text-sm-start">
                <Nav.Item>
                    <NavLink to="/dashboard" end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <FaHome className="me-2" /> <span className="d-none d-sm-inline-block">Dashboard</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/dashboard/quizzes" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <FaBook className="me-2" /> <span className="d-none d-sm-inline-block">Quizzes</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/dashboard/orders" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <FaShoppingCart className="me-2" /> <span className="d-none d-sm-inline-block">Orders</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/dashboard/analytics" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <FaChartLine className="me-2" /> <span className="d-none d-sm-inline-block">Analytics</span>
                    </NavLink>
                </Nav.Item>
                <Nav.Item>
                    <NavLink to="/dashboard/wallet" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <FaWallet className="me-2" /> <span className="d-none d-sm-inline-block">Wallet</span>
                    </NavLink>
                </Nav.Item>

            </Nav>

            <hr className="my-4 border-secondary" />
            <Nav className="text-center text-sm-start">
                <Nav.Item className="w-100">
                    <NavLink to="/dashboard/settings" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                        <FaCog className="me-2" /> <span className="d-none d-sm-inline-block">Settings</span>
                    </NavLink>
                </Nav.Item>
            </Nav>
        </div>
    );
}

export default Sidebar;
