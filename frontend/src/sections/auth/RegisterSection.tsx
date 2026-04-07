import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaGraduationCap, FaChalkboardTeacher, FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import NavigateHomeButton from "../../components/common/NavigateHomeButton";
import { useState } from "react";
import { USER_ROLES } from "./constants";
import { useRegister, handleToggle } from "../../hooks/useRegister";
import styles from "./RegisterSection.module.scss";

const RegisterSection = () => {
    const [name, setName] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [type, setType] = useState<'password' | 'text'>('password');
    const [role, setRole] = useState<(typeof USER_ROLES)[keyof typeof USER_ROLES]>(USER_ROLES.STUDENT);
    const [bankName, setBankName] = useState<string>("");
    const [bankAccount, setBankAccount] = useState<string>("");

    const { handleSubmit } = useRegister();
    return (
        <section className={styles.registerPage}>
            <div className="position-absolute top-1 start-1 m-3" ><NavigateHomeButton /></div>
            <Container fluid className="g-0">
                <Row className="min-vh-100 g-0">
                    {/* LEFT SIDE */}
                    <Col
                        md={6}
                        className={`${styles.registerLeft} d-none d-md-flex align-items-center justify-content-center`}
                    >
                        <h1 className="display-4 fw-bold text-gradient">QuizNote</h1>
                    </Col>

                    {/* RIGHT SIDE */}
                    <Col xs={12} md={6} className={`${styles.registerRight} d-flex align-items-center justify-content-center`}>
                        <div className={`${styles.formBox} p-4 p-sm-5 rounded-4 shadow`}>
                            <h3 className="fw-bold mb-2">Đăng kí tài khoản</h3>
                            <p className="text-muted mb-4">
                                Chọn loại tài khoản của bạn và bắt đầu hành trình với chúng tôi
                            </p>

                            {/* ROLE SELECTION */}
                            <div className={`d-flex gap-3 mb-4 ${styles.roleSelection}`}>
                                <div
                                    className={`${styles.roleCard} ${role === USER_ROLES.STUDENT ? styles.active : ''} flex-fill text-center p-3 rounded-3 w-50`}
                                    onClick={() => setRole(USER_ROLES.STUDENT)}
                                    style={{ cursor: 'pointer' }}

                                >
                                    <FaGraduationCap className="fs-4 mb-2" />
                                    <p className="fw-semibold mb-0">Student</p>
                                    <small className="text-muted">Tham gia các bài kiểm tra và theo dõi tiến trình</small>
                                </div>
                                <div
                                    className={`${styles.roleCard} ${role === USER_ROLES.SELLER ? styles.active : ''} flex-fill text-center p-3 rounded-3 w-50`}
                                    onClick={() => setRole(USER_ROLES.SELLER)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FaChalkboardTeacher className="fs-4 mb-2" />
                                    <p className="fw-semibold mb-0">Seller</p>
                                    <small className="text-muted">Tạo và bán các bài kiểm tra</small>
                                </div>
                            </div>

                            {/* SOCIAL LOGIN */}
                            <div className="d-flex gap-3 mb-4">
                                <Button variant="light" className="flex-fill border">
                                    <FcGoogle className="me-2" /> Google
                                </Button>
                                <Button variant="light" className="flex-fill border">
                                    <FaFacebookF className="me-2 text-primary" /> Facebook
                                </Button>
                            </div>

                            <div className="text-center text-muted mb-3">OR</div>

                            {/* FORM */}
                            <Form onSubmit={(e) => handleSubmit(e, name, gender, email, password, confirmPassword, role, bankName, bankAccount)}>
                                <Row className="g-3">

                                    <Col xs={12} sm={6}>
                                        <Form.Group controlId="name">
                                            <Form.Control type="text" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
                                        <Form.Group controlId="gender">
                                            <Form.Control type="select" as="select" value={gender} onChange={(e) => setGender(e.target.value)}>
                                                <option value="" disabled>Giới tính</option>
                                                <option value="MALE">Nam</option>
                                                <option value="FEMALE">Nữ</option>
                                                <option value="OTHER">Khác</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="email">
                                            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="password" className="position-relative">
                                            <Form.Control type={type} placeholder="Mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <span
                                                className={`${styles.showHideBtn} position-absolute end-0 top-50 translate-middle-y pe-2`}
                                                onClick={() => handleToggle(type, setType)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleToggle(type, setType);
                                                    }
                                                }}
                                            >
                                                {type === 'password' ? <IoMdEyeOff className="fs-4" /> : <IoEye className="fs-4" />}
                                            </span>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="confirmPassword" className="position-relative">
                                            <Form.Control type={type} placeholder="Xác nhận lại mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                                            <span
                                                className={`${styles.showHideBtn} position-absolute end-0 top-50 translate-middle-y pe-2`}
                                                onClick={() => handleToggle(type, setType)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleToggle(type, setType);
                                                    }
                                                }}
                                            >
                                                {type === 'password' ? <IoMdEyeOff className="fs-4" /> : <IoEye className="fs-4" />}
                                            </span>
                                        </Form.Group>
                                    </Col>

                                    {/* SELLER BANK INFO */}
                                    {role === USER_ROLES.SELLER && (
                                        <>
                                            <Col xs={12}>
                                                <Form.Group controlId="bankName">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Tên ngân hàng (ví dụ: Vietcombank, BIDV)"
                                                        value={bankName}
                                                        onChange={(e) => setBankName(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Group controlId="bankAccount">
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Số tài khoản ngân hàng"
                                                        value={bankAccount}
                                                        onChange={(e) => setBankAccount(e.target.value)}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </>
                                    )}
                                </Row>

                                <Button
                                    variant="primary"
                                    className={`${styles.btnGradient} w-100 mt-4 fw-semibold py-2`}
                                    type="submit"
                                >
                                    Đăng ký
                                </Button>
                            </Form>

                            <p className="text-center mt-4 text-muted">
                                Bạn đã có tài khoản?{" "}
                                <a href="/login" className="text-gradient fw-semibold text-decoration-none">
                                    Đăng nhập
                                </a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default RegisterSection;