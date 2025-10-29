import { useState } from "react";
import { Container, Nav, Card, Form, Button, Row, Col, Badge } from "react-bootstrap";
import {
    FaUserCircle,
    FaLock,
    FaBell,
    FaPalette,
    FaMoneyBillWave,
    FaEyeSlash,
    FaTrash,
} from "react-icons/fa";
import "./SellerSettings.scss";

function SellerSettings() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [theme, setTheme] = useState("dark");

    const renderTab = () => {
        switch (activeTab) {
            case "Profile":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Profile Information</h5>
                        <Row className="g-3 align-items-center">
                            <Col xs={12} md={3} className="text-center">
                                <FaUserCircle size="5rem" className="text-secondary mb-2" />
                                <Button variant="outline-light" size="sm">Change Photo</Button>
                            </Col>
                            <Col xs={12} md={9}>
                                <Form>
                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-light">First Name</Form.Label>
                                                <Form.Control type="text" value="Nguyen" className="bg-dark text-light border-secondary" />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-light">Last Name</Form.Label>
                                                <Form.Control type="text" value="Truong" className="bg-dark text-light border-secondary" />
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mt-3">
                                        <Form.Label className="text-light">Email</Form.Label>
                                        <Form.Control type="email" value="truong0795432149@gmail.com" disabled className="bg-dark text-light border-secondary" />
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Form.Label className="text-light">Bio</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            placeholder="Tell learners about your expertise or teaching style..."
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </Form.Group>
                                    <Button className="btn-gradient mt-4">Save Changes</Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                );

            case "Account":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Account Security</h5>
                        <Form>
                            <Row className="g-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="text-light">Current Password</Form.Label>
                                        <Form.Control type="password" className="bg-dark text-light border-secondary" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label className="text-light">New Password</Form.Label>
                                        <Form.Control type="password" className="bg-dark text-light border-secondary" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Button className="btn-gradient mt-4">Update Password</Button>
                        </Form>

                        <hr className="my-4 border-secondary" />

                        <h6 className="fw-semibold text-white mb-2">Connected Accounts</h6>
                        <p className="text-secondary small mb-3">Link social accounts for faster login.</p>
                        <div className="d-flex flex-wrap gap-3">
                            <Button variant="outline-light">Connect Google</Button>
                            <Button variant="outline-light">Connect Facebook</Button>
                        </div>
                    </Card>
                );

            case "Appearance":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Appearance Settings</h5>
                        <Row>
                            <Col md={6}>
                                <Form.Label className="text-light">Theme</Form.Label>
                                <div className="d-flex gap-3">
                                    {["dark", "light"].map((mode) => (
                                        <Card
                                            key={mode}
                                            onClick={() => setTheme(mode)}
                                            className={`theme-box ${theme === mode ? "active" : ""}`}
                                        >
                                            <div className={`theme-preview ${mode}`} />
                                            <p className="text-capitalize mt-2">{mode}</p>
                                        </Card>
                                    ))}
                                </div>
                            </Col>
                            <Col md={6}>
                                <Form.Label className="text-light mt-3 mt-md-0">Accent Color</Form.Label>
                                <div className="d-flex gap-3 flex-wrap">
                                    {["purple", "blue", "green", "red", "amber"].map((color) => (
                                        <div key={color} className={`color-dot ${color}`} />
                                    ))}
                                </div>
                            </Col>
                        </Row>
                        <Button className="btn-gradient mt-4">Save Preferences</Button>
                    </Card>
                );

            case "Privacy":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Privacy Settings</h5>
                        <Form.Check
                            type="switch"
                            id="switch1"
                            label="Hide email from public profile"
                            className="text-light mb-3"
                        />
                        <Form.Check
                            type="switch"
                            id="switch2"
                            label="Disable quiz recommendations"
                            className="text-light mb-3"
                        />

                        <div className="mt-4 p-3 bg-danger bg-opacity-25 rounded">
                            <h6 className="fw-bold text-danger mb-2">Danger Zone</h6>
                            <p className="text-light small mb-3">
                                Once you delete your account, all quizzes and data will be permanently removed.
                            </p>
                            <Button variant="danger">Delete Account</Button>
                        </div>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="seller-settings">
            <Container fluid="sm">
                <h3 className="fw-bold mb-3 text-gradient">Settings</h3>
                <p className="text-secondary mb-4">
                    Manage your account preferences and appearance.
                </p>

                <Nav variant="tabs" activeKey={activeTab} className="settings-tabs mb-4">
                    {["Profile", "Account", "Appearance", "Privacy"].map((tab) => (
                        <Nav.Item key={tab}>
                            <Nav.Link
                                eventKey={tab}
                                onClick={() => setActiveTab(tab)}
                                className={activeTab === tab ? "active" : ""}
                            >
                                {tab}
                            </Nav.Link>
                        </Nav.Item>
                    ))}
                </Nav>

                {renderTab()}
            </Container>
        </div>
    );
}

export default SellerSettings;
