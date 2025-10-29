import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaUser } from "react-icons/fa";
import "./RegisterLoginPage.scss";

function LoginPage() {
    return (
        <section className="login-page">
            <Container fluid className="g-0">
                <Row className="min-vh-100 g-0">
                    {/* LEFT SIDE */}
                    <Col
                        md={6}
                        className="login-left d-none d-md-flex align-items-center justify-content-center"
                    >
                        <h1 className="display-4 fw-bold text-gradient">QuizNote</h1>
                    </Col>

                    {/* RIGHT SIDE */}
                    <Col xs={12} md={6} className="login-right d-flex align-items-center justify-content-center">
                        <div className="form-box p-4 p-sm-5 rounded-4 shadow">
                            <h3 className="fw-bold mb-2">Welcome back</h3>
                            <p className="text-muted mb-4">
                                Enter your credentials to access your account
                            </p>

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
                            <Form>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group controlId="username">
                                            <Form.Control type="text" placeholder="Username" />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="email">
                                            <Form.Control type="email" placeholder="Email" />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="password">
                                            <Form.Control type="password" placeholder="Password" />
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Button
                                    variant="primary"
                                    className="w-100 mt-4 btn-gradient fw-semibold py-2"
                                    type="submit"
                                >
                                    Sign In
                                </Button>
                            </Form>

                            <p className="text-center mt-4 text-muted">
                                Don’t have an account?{" "}
                                <a href="/register" className="text-gradient fw-semibold text-decoration-none">
                                    Sign Up
                                </a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default LoginPage;
