import { useState, useEffect } from "react";
import { Container, Nav, Card, Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import {
    FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
    getCurrentUser,
    updateUserProfile,
    changePassword,
    uploadAvatar,
} from "../../services/apiService";
import { doLogout } from '../../redux/action/userAction';
import "./AdminSettingsPage.scss";
import axiosInstance from "../../utils/axiosCustomize";
import { useNavigate } from "react-router-dom";
const AdminSettingsPage = () => {
    const [activeTab, setActiveTab] = useState("Thông tin cá nhân");
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.account);
    const dispatch = useDispatch();
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/users/";
    // Profile state
    const [profileData, setProfileData] = useState({
        name: "",
        age: 0,
        address: "",
        gender: "MALE",
        bio: ""
    });

    // Password state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await getCurrentUser();
            if (response && response.data) {
                const data = response.data;
                setUserData(data);
                setProfileData({
                    name: data.name || "",
                    age: data.age || 0,
                    address: data.address || "",
                    gender: data.gender || "MALE",
                    bio: data.bio || ""
                });
                setAvatarPreview(backendBaseURL + data.avatarUrl);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Lỗi khi tải thông tin người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Kích thước file phải nhỏ hơn 5MB");
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) {
            toast.warning("Vui lòng chọn ảnh trước");
            return;
        }
        try {
            setLoading(true);
            const response = await uploadAvatar(userData?.email, avatarFile);
            if (response && response.data) {
                toast.success("Cập nhật ảnh đại diện thành công!");
                setAvatarFile(null);
                fetchUserData();
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error(error.response?.data?.message || "Lỗi khi tải ảnh đại diện");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const response = await updateUserProfile(profileData);
            if (response && response.data) {
                toast.success("Cập nhật thông tin cá nhân thành công!");
                fetchUserData();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Lỗi khi cập nhật thông tin cá nhân");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.warning("Vui lòng điền đầy đủ các trường mật khẩu");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }
        try {
            setLoading(true);
            const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
            if (response.statusCode === 400) {
                toast.error(response.message || "Lỗi khi đổi mật khẩu");
            } else {
                toast.success("Đổi mật khẩu thành công!");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Lỗi khi đổi mật khẩu");
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        dispatch({ type: "user/logout" });
        toast.success("Đăng xuất thành công");
    }

    const renderTab = () => {
        switch (activeTab) {
            case "Thông tin cá nhân":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Thông tin cá nhân</h5>
                        {loading && <Spinner animation="border" variant="light" className="mb-3" />}
                        <Row className="g-3 align-items-center">
                            <Col xs={12} md={3} className="text-center">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="Avatar"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                            marginBottom: "10px"
                                        }}
                                    />
                                ) : (
                                    <FaUserCircle size="5rem" className="text-secondary mb-2" />
                                )}
                                <div>
                                    <input
                                        type="file"
                                        id="avatar-upload"
                                        accept="image/*"
                                        onChange={handleAvatarChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div className="d-flex gap-1 justify-content-center">
                                        <Button
                                            variant="outline-light"
                                            size="sm"
                                            onClick={() => document.getElementById('avatar-upload').click()}
                                            className="mb-2 btn-gradient"
                                        >
                                            Chọn ảnh
                                        </Button>
                                        {avatarFile && (
                                            <Button
                                                variant="outline-light"
                                                size="sm"
                                                onClick={handleUploadAvatar}
                                                disabled={loading}
                                                className="mb-2 hover-gradient"
                                            >
                                                Tải lên
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={9}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light">Họ và tên</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light">Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            value={userData?.email || ""}
                                            disabled
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </Form.Group>

                                    <Row className="g-3">
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-light">Tuổi</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="age"
                                                    value={profileData.age}
                                                    onChange={handleProfileChange}
                                                    className="bg-dark text-light border-secondary"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group>
                                                <Form.Label className="text-light">Giới tính</Form.Label>
                                                <Form.Select
                                                    name="gender"
                                                    value={profileData.gender}
                                                    onChange={handleProfileChange}
                                                    className="bg-dark text-light border-secondary"
                                                >
                                                    <option value="MALE">Nam</option>
                                                    <option value="FEMALE">Nữ</option>
                                                    <option value="OTHER">Khác</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mt-3">
                                        <Form.Label className="text-light">Địa chỉ</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Form.Label className="text-light">Tiểu sử</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            placeholder="Hãy kể cho người học về chuyên môn hoặc phong cách giảng dạy của bạn..."
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </Form.Group>
                                    <Button
                                        className="btn-gradient mt-4"
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                    >
                                        {loading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                    </Card>
                );

            case "Tài khoản":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Bảo mật tài khoản</h5>
                        {loading && <Spinner animation="border" variant="light" className="mb-3" />}
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Mật khẩu hiện tại</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Nhập mật khẩu hiện tại"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Mật khẩu mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Xác nhận mật khẩu mới</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Xác nhận mật khẩu mới"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>

                            <Button
                                className="btn-gradient mt-3"
                                onClick={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                            </Button>
                        </Form>

                        <hr className="my-4 border-secondary" />

                        <h6 className="fw-semibold text-white mb-2">Tài khoản kết nối</h6>
                        <p className="text-secondary small mb-3">Liên kết tài khoản mạng xã hội để đăng nhập nhanh hơn.</p>
                        <div className="d-flex flex-wrap gap-3">
                            <Button variant="outline-light" disabled>Kết nối Google (Sắp ra mắt)</Button>
                            <Button variant="outline-light" disabled>Kết nối Facebook (Sắp ra mắt)</Button>
                        </div>
                        <hr />
                        <Button
                            className="btn-gradient mt-3"
                            onClick={() => {
                                dispatch(doLogout());
                                toast.success("Logged out successfully");
                                navigate("/");
                            }}

                        >
                            Đăng xuất
                        </Button>
                    </Card>
                );

            default:
                return null;
        }
    };

    return (
        <div className="seller-settings">
            <Container fluid="sm">
                <h3 className="fw-bold mb-3 text-gradient">Cài đặt</h3>
                <p className="text-secondary mb-4">
                    Quản lí thông tin cá nhân và bảo mật tài khoản của bạn tại đây.
                </p>

                <Nav variant="tabs" activeKey={activeTab} className="settings-tabs mb-4">
                    {["Thông tin cá nhân", "Tài khoản"].map((tab) => (
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

export default AdminSettingsPage;
