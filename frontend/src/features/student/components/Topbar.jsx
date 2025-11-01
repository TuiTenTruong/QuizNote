import { Navbar, Form, InputGroup, Button } from "react-bootstrap";
import { FaSearch, FaBell, FaUserCircle, FaBars } from "react-icons/fa";
import PropTypes from "prop-types";

const Topbar = ({ onToggleSidebar }) => {
    return (
        <Navbar
            expand="md"
            className="bg-dark text-light px-3 d-flex justify-content-between align-items-center border-bottom border-secondary"
            style={{ height: "64px" }}
        >
            {/* Left Section: Toggle button (for mobile) */}
            <Button
                variant="outline-secondary"
                className="d-md-none border-0 text-light"
                onClick={onToggleSidebar}
            >
                <FaBars size={18} />
            </Button>

            {/* Center Section: Search bar */}
            <InputGroup className="d-none d-md-flex" style={{ maxWidth: "320px" }}>
                <InputGroup.Text className="bg-dark border-secondary text-light">
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="text"
                    placeholder="Search quizzes..."
                    className="bg-dark text-light border-secondary"
                />
            </InputGroup>

            {/* Right Section: Notifications + Profile */}
            <div className="d-flex align-items-center gap-3 ms-auto">
                <FaBell size={18} className="text-secondary cursor-pointer" />
                <div className="d-flex align-items-center gap-2">
                    <FaUserCircle size={28} />
                    <span className="fw-semibold d-none d-sm-inline">Student</span>
                </div>
            </div>
        </Navbar>
    );
}

Topbar.propTypes = {
    onToggleSidebar: PropTypes.func,
};

export default Topbar;
