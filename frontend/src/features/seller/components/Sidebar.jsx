import { Nav, NavbarBrand } from "react-bootstrap";
import { FaHome, FaBook, FaShoppingCart, FaChartLine, FaWallet, FaCog, FaTimes } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import "./SellerAppbar.scss";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
    return (
        <>
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={toggleSidebar}></div>
            )}

            <div className={`sidebar p-3 p-sm-4 text-light ${isSidebarOpen ? 'show' : ''}`}>
                {/* Close button for mobile */}
                <button className="btn-close-sidebar d-md-none" onClick={toggleSidebar}>
                    <FaTimes />
                </button>

                <div className="brand mb-4 text-center">
                    <NavbarBrand as={Link} to="/">
                        <h4 className="text-gradient fw-bold">QuizNote</h4>
                    </NavbarBrand>
                </div>

                <Nav className="flex-column">
                    <Nav.Item>
                        <NavLink
                            to="/seller"
                            end
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaHome className="me-2" /> <span>Dashboard</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/seller/quizzes"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaBook className="me-2" /> <span>Quizzes</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/seller/orders"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaShoppingCart className="me-2" /> <span>Orders</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/seller/analytics"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaChartLine className="me-2" /> <span>Analytics</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/seller/wallet"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaWallet className="me-2" /> <span>Wallet</span>
                        </NavLink>
                    </Nav.Item>
                </Nav>

                <hr className="my-4 border-secondary" />

                <Nav>
                    <Nav.Item className="w-100">
                        <NavLink
                            to="/seller/settings"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaCog className="me-2" /> <span>Settings</span>
                        </NavLink>
                    </Nav.Item>
                </Nav>
            </div>
        </>
    );
}

export default Sidebar;
