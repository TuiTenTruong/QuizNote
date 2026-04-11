import { useRef } from "react";
import type { ChangeEvent } from "react";
import { Button, Card, Col, Form, Row, Spinner } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import type {
    ProfileChangeEvent,
    UserData,
    UserProfile
} from "../../types/settings.types";

interface ProfileSectionProps {
    loading: boolean;
    userData: UserData | null;
    profileData: UserProfile;
    avatarFile: File | null;
    avatarPreview: string | null;
    onProfileChange: (event: ProfileChangeEvent) => void;
    onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onUploadAvatar: () => void;
    onSaveProfile: () => void;
}

const avatarStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px"
} as const;

const ProfileSection = ({
    loading,
    userData,
    profileData,
    avatarFile,
    avatarPreview,
    onProfileChange,
    onAvatarChange,
    onUploadAvatar,
    onSaveProfile
}: ProfileSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Card className="bg-dark border-0 p-4 shadow-sm">
            <h5 className="fw-semibold text-white mb-3">Thông tin cá nhân</h5>
            {loading && <Spinner animation="border" variant="light" className="mb-3" />}
            <Row className="g-3 align-items-center">
                <Col xs={12} md={3} className="text-center">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" style={avatarStyle} />
                    ) : (
                        <FaUserCircle size="5rem" className="text-secondary mb-2" />
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onAvatarChange}
                        style={{ display: "none" }}
                    />
                    <div className="d-flex gap-1 justify-content-center">
                        <Button
                            variant="outline-light"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="mb-2 btn-gradient"
                        >
                            Chọn ảnh
                        </Button>
                        {avatarFile && (
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={onUploadAvatar}
                                disabled={loading}
                                className="mb-2 hover-gradient"
                            >
                                Tải lên
                            </Button>
                        )}
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
                                onChange={onProfileChange}
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="text-light">Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={userData?.email ?? ""}
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
                                        onChange={onProfileChange}
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
                                        onChange={onProfileChange}
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
                                onChange={onProfileChange}
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
                                onChange={onProfileChange}
                                placeholder="Hãy kể cho người học về chuyên môn hoặc phong cách giảng dạy của bạn..."
                                className="bg-dark text-light border-secondary"
                            />
                        </Form.Group>
                        <Button className="btn-gradient mt-4" onClick={onSaveProfile} disabled={loading}>
                            {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Card>
    );
};

export default ProfileSection;
