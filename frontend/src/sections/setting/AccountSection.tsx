import { Button, Card, Form, Spinner } from "react-bootstrap";
import type { PasswordChangeEvent, PasswordData } from "../../types/settings.types";

interface AccountSectionProps {
    loading: boolean;
    passwordData: PasswordData;
    onPasswordChange: (event: PasswordChangeEvent) => void;
    onChangePassword: () => void;
    onLogout: () => void;
}

const AccountSection = ({
    loading,
    passwordData,
    onPasswordChange,
    onChangePassword,
    onLogout
}: AccountSectionProps) => {
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
                        onChange={onPasswordChange}
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
                        onChange={onPasswordChange}
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
                        onChange={onPasswordChange}
                        placeholder="Xác nhận mật khẩu mới"
                        className="bg-dark text-light border-secondary"
                    />
                </Form.Group>

                <Button className="btn-gradient mt-3" onClick={onChangePassword} disabled={loading}>
                    {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                </Button>
            </Form>

            <hr className="my-4 border-secondary" />

            <h6 className="fw-semibold text-white mb-2">Tài khoản kết nối</h6>
            <p className="text-secondary small mb-3">Liên kết tài khoản mạng xã hội để đăng nhập nhanh hơn.</p>
            <div className="d-flex flex-wrap gap-3">
                <Button variant="outline-light" disabled>
                    Kết nối Google (Sắp ra mắt)
                </Button>
                <Button variant="outline-light" disabled>
                    Kết nối Facebook (Sắp ra mắt)
                </Button>
            </div>
            <hr />
            <Button className="btn-gradient mt-3" onClick={onLogout}>
                Đăng xuất
            </Button>
        </Card>
    );
};

export default AccountSection;
