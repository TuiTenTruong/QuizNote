import { Nav, NavbarBrand } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { NavLink, Link } from "react-router-dom";
import { SidebarProps } from "./Sidebar.types";
import styles from "./Sidebar.module.scss";

const Sidebar = ({
    isSidebarOpen,
    toggleSidebar,
    brandLink = "/",
    navItems = [],
    settingsItems = []
}: SidebarProps) => {
    const handleNavClick = () => {
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    };

    return (
        <>
            {isSidebarOpen && (
                <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>
            )}

            <div className={`${styles.sidebar} p-3 p-sm-4 text-light ${isSidebarOpen ? styles.show : ''}`}>
                <button className={`${styles.btnCloseSidebar} d-md-none`} onClick={toggleSidebar}>
                    <FaTimes />
                </button>

                <div className="mb-4 text-center">
                    <NavbarBrand as={Link} to={brandLink}>
                        <h4 className={`${styles.textGradient} fw-bold`}>QuizNote</h4>
                    </NavbarBrand>
                </div>

                <Nav className="flex-column">
                    {navItems.map((item, index) => (
                        <Nav.Item key={index}>
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`.trim()}
                                onClick={handleNavClick}
                            >
                                {item.icon && <item.icon className="me-2" />}
                                <span>{item.label}</span>
                            </NavLink>
                        </Nav.Item>
                    ))}
                </Nav>

                {settingsItems.length > 0 && (
                    <>
                        <hr className="my-4 border-secondary" />
                        <Nav>
                            {settingsItems.map((item, index) => (
                                <Nav.Item key={index} className="w-100">
                                    <NavLink
                                        to={item.path}
                                        end={item.end}
                                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`.trim()}
                                        onClick={handleNavClick}
                                    >
                                        {item.icon && <item.icon className="me-2" />}
                                        <span>{item.label}</span>
                                    </NavLink>
                                </Nav.Item>
                            ))}
                        </Nav>
                    </>
                )}
            </div>
        </>
    );
};

export default Sidebar;
