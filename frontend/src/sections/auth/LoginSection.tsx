import { useState } from "react";
import NavigateHomeButton from "../../components/common/NavigateHomeButton";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { FaFacebookF } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { useLogin, handleToggle } from "../../hooks/useLogin";
import styles from "./LoginSection.module.scss";

const LoginSection: React.FC = () => {
    const [type, setType] = useState<'password' | 'text'>('password');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { handleSubmit } = useLogin();

    return (
        <section className={styles.loginPage}>
            <div className="position-absolute top-1 start-1 m-3">
                <NavigateHomeButton />
            </div>
            <Container fluid className="g-0">
                <Row className="min-vh-100 g-0">
                    <Col
                        md={6}
                        className={`${styles.loginLeft} d-none d-md-flex align-items-center justify-content-center`}
                    >
                        <h1 className="display-4 fw-bold text-gradient">QuizNote</h1>
                    </Col>

                    <Col xs={12} md={6} className={`${styles.loginRight} d-flex align-items-center justify-content-center`}>
                        <div className={`${styles.formBox} p-4 p-sm-5 rounded-4 shadow`}>
                            <h3 className="fw-bold mb-2">Chào mừng bạn trở lại</h3>
                            <p className="text-muted mb-4">
                                Nhập thông tin xác thực của bạn để truy cập tài khoản
                            </p>

                            <div className="d-flex gap-3 mb-4">
                                <Button variant="light" className="flex-fill border">
                                    <FcGoogle className="me-2" /> Google
                                </Button>
                                <Button variant="light" className="flex-fill border">
                                    <FaFacebookF className="me-2 text-primary" /> Facebook
                                </Button>
                            </div>

                            <div className="text-center text-muted mb-3">HOẶC</div>

                            <Form onSubmit={(e) => handleSubmit(email, password, e)}>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group controlId="email">
                                            <Form.Control
                                                type="email"
                                                placeholder="Email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="password" className="position-relative">
                                            <Form.Control
                                                type={type}
                                                placeholder="Mật khẩu"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
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
                                                {type === 'password' ? (
                                                    <IoMdEyeOff className="fs-4" />
                                                ) : (
                                                    <IoEye className="fs-4" />
                                                )}
                                            </span>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    variant="primary"
                                    className={`w-100 mt-4 ${styles.btnGradient} fw-semibold py-2`}
                                    type="submit"
                                >
                                    Đăng nhập
                                </Button>
                            </Form>

                            <p className="text-center mt-4 text-muted">
                                Bạn chưa có tài khoản?{" "}
                                <a href="/register" className="text-gradient fw-semibold text-decoration-none">
                                    Đăng ký
                                </a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default LoginSection;