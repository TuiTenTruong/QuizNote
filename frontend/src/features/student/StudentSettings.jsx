import { useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Alert,
    Badge,
} from "react-bootstrap";
import { FaUser, FaLock, FaPalette, FaBell } from "react-icons/fa";
import "./StudentSettings.scss";

const StudentSettings = () => {
    const [profile, setProfile] = useState({
        fullName: "Nguyễn Văn A",
        email: "vana@example.com",
    });

    const [password, setPassword] = useState({
        current: "",
        newPass: "",
        confirm: "",
    });

    const [preferences, setPreferences] = useState({
        theme: "dark",
        notifications: true,
    });

    const [successMsg, setSuccessMsg] = useState("");

    const handleProfileSave = (e) => {
        e.preventDefault();
        setSuccessMsg("Thông tin tài khoản đã được cập nhật thành công!");
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (password.newPass !== password.confirm) {
            setSuccessMsg("❌ Mật khẩu xác nhận không trùng khớp!");
            return;
        }
        setSuccessMsg("✅ Mật khẩu đã được thay đổi!");
        setPassword({ current: "", newPass: "", confirm: "" });
    };

    const handlePreferenceSave = (e) => {
        e.preventDefault();
        setSuccessMsg("Cài đặt giao diện và thông báo đã được lưu!");
    };

    return (
        <div className="student-settings bg-black text-light min-vh-100 py-4">
            <Container>
                <h4 className="fw-bold mb-4">Cài đặt tài khoản</h4>

                {successMsg && (
                    <Alert
                        variant="success"
                        className="bg-dark text-success border border-success mb-4"
                    >
                        {successMsg}
                    </Alert>
                )}

                <Row className="g-4">
                    {/* Thông tin tài khoản */}
                    <Col lg={6}>
                        <Card className="bg-dark border-secondary p-4 h-100">
                            <h6 className="fw-bold mb-3 text-light d-flex align-items-center gap-2">
                                <FaUser /> Thông tin cá nhân
                            </h6>
                            <Form onSubmit={handleProfileSave}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Họ và tên</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={profile.fullName}
                                        onChange={(e) =>
                                            setProfile({ ...profile, fullName: e.target.value })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile({ ...profile, email: e.target.value })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />
                                </Form.Group>

                                <Button type="submit" variant="gradient" className="w-100">
                                    Lưu thay đổi
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    {/* Đổi mật khẩu */}
                    <Col lg={6}>
                        <Card className="bg-dark border-secondary p-4 h-100">
                            <h6 className="fw-bold mb-3 text-light d-flex align-items-center gap-2">
                                <FaLock /> Đổi mật khẩu
                            </h6>
                            <Form onSubmit={handlePasswordChange}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu hiện tại</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password.current}
                                        onChange={(e) =>
                                            setPassword({ ...password, current: e.target.value })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password.newPass}
                                        onChange={(e) =>
                                            setPassword({ ...password, newPass: e.target.value })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                    <Form.Control
                                        type="password"
                                        value={password.confirm}
                                        onChange={(e) =>
                                            setPassword({ ...password, confirm: e.target.value })
                                        }
                                        className="bg-black text-light border-secondary"
                                    />
                                </Form.Group>

                                <Button type="submit" variant="gradient" className="w-100">
                                    Cập nhật mật khẩu
                                </Button>
                            </Form>
                        </Card>
                    </Col>

                    {/* Cài đặt giao diện & thông báo */}
                    <Col lg={12}>
                        <Card className="bg-dark border-secondary p-4">
                            <h6 className="fw-bold mb-3 text-light d-flex align-items-center gap-2">
                                <FaPalette /> Giao diện & <FaBell /> Thông báo
                            </h6>
                            <Form onSubmit={handlePreferenceSave}>
                                <Row className="g-3 align-items-center">
                                    <Col md={6}>
                                        <Form.Label>Chủ đề</Form.Label>
                                        <Form.Select
                                            value={preferences.theme}
                                            onChange={(e) =>
                                                setPreferences({
                                                    ...preferences,
                                                    theme: e.target.value,
                                                })
                                            }
                                            className="bg-black text-light border-secondary"
                                        >
                                            <option value="dark">Tối (Dark)</option>
                                            <option value="light">Sáng (Light)</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Check
                                            type="switch"
                                            id="notifications"
                                            label="Bật thông báo email"
                                            checked={preferences.notifications}
                                            onChange={(e) =>
                                                setPreferences({
                                                    ...preferences,
                                                    notifications: e.target.checked,
                                                })
                                            }
                                            className="text-light"
                                        />
                                    </Col>
                                </Row>
                                <div className="text-end mt-4">
                                    <Button type="submit" variant="gradient">
                                        Lưu cài đặt
                                    </Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default StudentSettings;
