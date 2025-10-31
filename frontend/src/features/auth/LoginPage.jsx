import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaUser } from "react-icons/fa";
import { useState } from "react";
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { toast } from "react-toastify";
import "./RegisterLoginPage.scss";
import { postLogin } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLogin } from "../../redux/action/userAction";
const LoginPage = () => {
    const [type, setType] = useState('password');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const handleToggle = () => {
        if (type === 'password') {
            setType('text')
        } else {
            setType('password')
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }
        const response = await postLogin(email, password);
        console.log(response);
        if (response && (response.statusCode === 200 || response.statusCode === 201)) {
            dispatch(doLogin(response.data));
            toast.success("Login successful!");
            navigate("/");
        } else {
            toast.error("Login failed. Please check your credentials.");
        }
    }
    return (
        <section className="login-page">
            <Container fluid className="g-0">
                <Row className="min-vh-100 g-0">
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
                            <Form onSubmit={handleSubmit}>
                                <Row className="g-3">
                                    <Col xs={12}>
                                        <Form.Group controlId="email">
                                            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12}>
                                        <Form.Group controlId="password" className="position-relative">
                                            <Form.Control type={type} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <span className="show-hide-btn position-absolute end-0 top-50 translate-middle-y pe-2" onClick={handleToggle}>
                                                {type === 'password' ? <IoMdEyeOff className="fs-4" /> : <IoEye className="fs-4" />}
                                            </span>
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
