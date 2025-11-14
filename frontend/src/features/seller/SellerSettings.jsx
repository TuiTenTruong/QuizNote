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
import "./SellerSettings.scss";
import axiosInstance from "../../utils/axiosCustomize";
import { useNavigate } from "react-router-dom";
const SellerSettings = () => {
    const [activeTab, setActiveTab] = useState("Profile");
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
            toast.error("Failed to load user data");
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
                toast.error("File size must be less than 5MB");
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
            toast.warning("Please select an image first");
            return;
        }
        try {
            setLoading(true);
            const response = await uploadAvatar(userData?.email, avatarFile);
            if (response && response.data) {
                toast.success("Avatar updated successfully!");
                setAvatarFile(null);
                fetchUserData();
            }
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error(error.response?.data?.message || "Failed to upload avatar");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const response = await updateUserProfile(profileData);
            if (response && response.data) {
                toast.success("Profile updated successfully!");
                fetchUserData();
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.warning("Please fill in all password fields");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        try {
            setLoading(true);
            const response = await changePassword(passwordData.currentPassword, passwordData.newPassword);
            if (response.statusCode === 400) {
                toast.error(response.message || "Failed to change password");
            } else {
                toast.success("Password changed successfully!");
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
            }
        } catch (error) {
            console.error("Error changing password:", error);
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        dispatch({ type: "user/logout" });
        toast.success("Logged out successfully");
    }

    const renderTab = () => {
        switch (activeTab) {
            case "Profile":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Profile Information</h5>
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
                                            Choose Photo
                                        </Button>
                                        {avatarFile && (
                                            <Button
                                                variant="outline-light"
                                                size="sm"
                                                onClick={handleUploadAvatar}
                                                disabled={loading}
                                                className="mb-2 hover-gradient"
                                            >
                                                Upload
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                            <Col xs={12} md={9}>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="text-light">Full Name</Form.Label>
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
                                                <Form.Label className="text-light">Age</Form.Label>
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
                                                <Form.Label className="text-light">Gender</Form.Label>
                                                <Form.Select
                                                    name="gender"
                                                    value={profileData.gender}
                                                    onChange={handleProfileChange}
                                                    className="bg-dark text-light border-secondary"
                                                >
                                                    <option value="MALE">Male</option>
                                                    <option value="FEMALE">Female</option>
                                                    <option value="OTHER">Other</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Form.Group className="mt-3">
                                        <Form.Label className="text-light">Address</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="address"
                                            value={profileData.address}
                                            onChange={handleProfileChange}
                                            className="bg-dark text-light border-secondary"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mt-3">
                                        <Form.Label className="text-light">Bio</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleProfileChange}
                                            placeholder="Tell learners about your expertise or teaching style..."
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

            case "Account":
                return (
                    <Card className="bg-dark border-0 p-4 shadow-sm">
                        <h5 className="fw-semibold text-white mb-3">Account Security</h5>
                        {loading && <Spinner animation="border" variant="light" className="mb-3" />}
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Current Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter current password"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Enter new password (min 6 characters)"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label className="text-light">Confirm New Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                    className="bg-dark text-light border-secondary"
                                />
                            </Form.Group>

                            <Button
                                className="btn-gradient mt-3"
                                onClick={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </Button>
                        </Form>

                        <hr className="my-4 border-secondary" />

                        <h6 className="fw-semibold text-white mb-2">Connected Accounts</h6>
                        <p className="text-secondary small mb-3">Link social accounts for faster login.</p>
                        <div className="d-flex flex-wrap gap-3">
                            <Button variant="outline-light" disabled>Connect Google (Coming soon)</Button>
                            <Button variant="outline-light" disabled>Connect Facebook (Coming soon)</Button>
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
                            Logout
                        </Button>
                    </Card>
                );

            // case "Appearance":
            //     return (
            //         <Card className="bg-dark border-0 p-4 shadow-sm">
            //             <h5 className="fw-semibold text-white mb-3">Appearance Settings</h5>
            //             {loading && <Spinner animation="border" variant="light" className="mb-3" />}
            //             <Row>
            //                 <Col md={6}>
            //                     <Form.Label className="text-light">Theme</Form.Label>
            //                     <div className="d-flex gap-3 mb-3">
            //                         {["dark", "light"].map((mode) => (
            //                             <Card
            //                                 key={mode}
            //                                 onClick={() => handlePreferenceChange("theme", mode)}
            //                                 className={`theme-box ${preferences.theme === mode ? "active" : ""}`}
            //                                 style={{ cursor: "pointer" }}
            //                             >
            //                                 <div className={`theme-preview ${mode}`} />
            //                                 <p className="text-capitalize mt-2 mb-0">
            //                                     {mode}
            //                                     {preferences.theme === mode && <FaCheck className="ms-2" />}
            //                                 </p>
            //                             </Card>
            //                         ))}
            //                     </div>
            //                 </Col>
            //                 <Col md={6}>
            //                     <Form.Label className="text-light mt-3 mt-md-0">Accent Color</Form.Label>
            //                     <div className="d-flex gap-3 flex-wrap">
            //                         {["purple", "blue", "green", "red", "amber"].map((color) => (
            //                             <div
            //                                 key={color}
            //                                 className={`color-dot ${color} ${preferences.accentColor === color ? "selected" : ""}`}
            //                                 onClick={() => handlePreferenceChange("accentColor", color)}
            //                                 style={{
            //                                     cursor: "pointer",
            //                                     border: preferences.accentColor === color ? "3px solid white" : "none"
            //                                 }}
            //                             />
            //                         ))}
            //                     </div>
            //                 </Col>
            //             </Row>
            //             <Button
            //                 className="btn-gradient mt-4"
            //                 onClick={handleSavePreferences}
            //                 disabled={loading}
            //             >
            //                 {loading ? "Saving..." : "Save Preferences"}
            //             </Button>
            //         </Card>
            //     );

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
                    {["Profile", "Account"].map((tab) => (
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
