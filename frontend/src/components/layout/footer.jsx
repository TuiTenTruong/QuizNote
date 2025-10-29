import { Container, Row, Col } from "react-bootstrap";
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaEnvelope,
    FaPhoneAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.scss";

const Footer = () => {
    return (
        <footer className="footer text-light pt-5">
            <Container>
                <Row className="gy-4">
                    {/* --- Logo + intro --- */}
                    <Col xs={12} md={4}>
                        <h4 className="fw-bold text-gradient mb-3">QuizNote</h4>
                        <p className="text-white-50 mb-3">
                            A modern platform for students and teachers to create, buy, and practice quiz sets
                            anytime, anywhere.
                        </p>
                        <div className="d-flex gap-3 fs-5 mt-3">
                            <a href="#" className="text-light social-link"><FaFacebookF /></a>
                            <a href="#" className="text-light social-link"><FaTwitter /></a>
                            <a href="#" className="text-light social-link"><FaInstagram /></a>
                            <a href="#" className="text-light social-link"><FaLinkedinIn /></a>
                            <a href="#" className="text-light social-link"><FaYoutube /></a>
                        </div>
                    </Col>

                    {/* --- Quick Links --- */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">Quick Links</h6>
                        <ul className="list-unstyled text-white-50">
                            <li><a href="#" className="footer-link">Home</a></li>
                            <li><a href="#" className="footer-link">About</a></li>
                            <li><a href="#" className="footer-link">Features</a></li>
                            <li><a href="#" className="footer-link">Pricing</a></li>
                            <li><a href="#" className="footer-link">Contact</a></li>
                        </ul>
                    </Col>

                    {/* --- For Teachers --- */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">For Teachers</h6>
                        <ul className="list-unstyled text-white-50">
                            <li><a href="#" className="footer-link">Create Quiz</a></li>
                            <li><a href="#" className="footer-link">Dashboard</a></li>
                            <li><a href="#" className="footer-link">Guidelines</a></li>
                            <li><a href="#" className="footer-link">Blog</a></li>
                        </ul>
                    </Col>

                    {/* --- Contact Info --- */}
                    <Col xs={12} md={2}>
                        <h6 className="fw-semibold mb-3">Contact Us</h6>
                        <p className="text-white-50 small mb-2">
                            <FaEnvelope className="me-2 text-gradient" /> support@QuizNote.com
                        </p>
                        <p className="text-white-50 small mb-2">
                            <FaPhoneAlt className="me-2 text-gradient" /> +84 987 654 321
                        </p>
                        <p className="text-white-50 small">
                            <FaMapMarkerAlt className="me-2 text-gradient" /> 123 Nguyen Van Linh, Can Tho
                        </p>
                    </Col>
                </Row>

                {/* --- Bottom line --- */}
                <hr className="border-secondary my-4" />
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pb-3 small text-white-50">
                    <p className="mb-2 mb-sm-0">© 2025 QuizNote. All Rights Reserved.</p>
                    <p className="mb-0">
                        <a href="#" className="footer-link">Terms</a> |{" "}
                        <a href="#" className="footer-link">Privacy Policy</a>
                    </p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;
