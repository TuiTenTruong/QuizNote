import { Nav, NavbarBrand } from "react-bootstrap";
import {
    FaHome,
    FaBook,
    FaUsers,
    FaShoppingCart,
    FaChartLine,
    FaCog,
    FaTimes,
    FaFileAlt,
    FaShieldAlt
    , FaClock
    , FaGift
} from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import "./AdminAppbar.scss";

const SideBar = ({ isSidebarOpen, toggleSidebar }) => {
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
                            to="/admin"
                            end
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaHome className="me-2" /> <span>Trang chủ</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaUsers className="me-2" /> <span>Người dùng</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/admin/permissions"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaShieldAlt className="me-2" /> <span>Phân quyền</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/admin/subjects"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaBook className="me-2" /> <span>Môn học</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/admin/orders"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaShoppingCart className="me-2" /> <span>Đơn hàng</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/admin/weekly-quizzes"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaClock className="me-2" /> <span>Weekly Quiz</span>
                        </NavLink>
                    </Nav.Item>
                    <Nav.Item>
                        <NavLink
                            to="/admin/rewards"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaGift className="me-2" /> <span>Rewards</span>
                        </NavLink>
                    </Nav.Item>
                </Nav>

                <hr className="my-4 border-secondary" />

                <Nav>
                    <Nav.Item className="w-100">
                        <NavLink
                            to="/admin/settings"
                            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
                            onClick={() => window.innerWidth < 768 && toggleSidebar()}
                        >
                            <FaCog className="me-2" /> <span>Cài đặt</span>
                        </NavLink>
                    </Nav.Item>
                </Nav>
            </div>
        </>
    );
}

export default SideBar;
