import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock, FaChalkboardTeacher, FaGraduationCap } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import "./RegisterLoginPage.scss";
import { AiFillYuque } from "react-icons/ai";
import { LinearGradient } from 'react-text-gradients'


function RegisterPage() {
    return (
        <section className="register-page">
            <Container fluid className="g-0">
                <Row className="min-vh-100 g-0">
                    {/* LEFT SIDE */}
                    <Col
                        md={6}
                        className="register-left d-none d-md-flex align-items-center justify-content-center"
                    >
                        <h1 className="display-4 fw-bold text-gradient">QuizNote</h1>
                    </Col>

                    {/* RIGHT SIDE */}
                    <Col xs={12} md={6} className="register-right d-flex align-items-center justify-content-center">
                        <div className="form-box p-4 p-sm-5 rounded-4 shadow">
                            <h3 className="fw-bold mb-2">Create Account</h3>
                            <p className="text-muted mb-4">
                                Choose your account type and start your journey with us
                            </p>

                            {/* ROLE SELECTION */}
                            <div className="d-flex gap-3 mb-4 flex-column flex-sm-row">
                                <div className="role-card active flex-fill text-center p-3 rounded-3">
                                    <FaGraduationCap className="fs-4 mb-2" />
                                    <p className="fw-semibold mb-0">Student</p>
                                    <small className="text-muted">Take quizzes and track progress</small>
                                </div>
                                <div className="role-card flex-fill text-center p-3 rounded-3">
                                    <FaChalkboardTeacher className="fs-4 mb-2" />
                                    <p className="fw-semibold mb-0">Teacher</p>
                                    <small className="text-muted">Create and manage quizzes</small>
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
                            <Form>
                                <Row className="g-3">
                                    <Col xs={12} sm={6}>
                                        <Form.Group controlId="fullname">
                                            <Form.Control type="text" placeholder="Full Name" />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} sm={6}>
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
                                    Sign Up
                                </Button>
                            </Form>

                            <p className="text-center mt-4 text-muted">
                                Already have an account?{" "}
                                <a href="/login" className="text-gradient fw-semibold text-decoration-none">
                                    Sign In
                                </a>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}

export default RegisterPage;
