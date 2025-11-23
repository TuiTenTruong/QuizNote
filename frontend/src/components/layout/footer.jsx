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
import { Link } from "react-router-dom";
const Footer = () => {
    return (
        <footer className="footer text-light pt-5">
            <Container>
                <Row className="gy-4">
                    {/* --- Logo + intro --- */}
                    <Col xs={12} md={4}>
                        <h4 className="fw-bold text-gradient mb-3">QuizNote</h4>
                        <p className="text-white-50 mb-3">

                            Một nền tảng hiện đại cho học sinh và giáo viên để tạo, mua và luyện tập các bộ câu đố bất cứ lúc nào, bất cứ nơi đâu.
                        </p>
                        <div className="d-flex gap-3 fs-5 mt-3">
                            <Link to="#" className="text-light social-link"><FaFacebookF /></Link>
                            <Link to="#" className="text-light social-link"><FaTwitter /></Link>
                            <Link to="#" className="text-light social-link"><FaInstagram /></Link>
                            <Link to="#" className="text-light social-link"><FaLinkedinIn /></Link>
                            <Link to="#" className="text-light social-link"><FaYoutube /></Link>
                        </div>
                    </Col>

                    {/* --- Quick Links --- */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">Quick Links</h6>
                        <ul className="list-unstyled text-white-50">
                            <li><Link to="#" className="footer-link"></Link></li>
                            <li><Link to="/" className="footer-link">Giới thiệu</Link></li>
                            <li><Link to="/student" className="footer-link">Môn học</Link></li>
                            <li><Link to="/rewards" className="footer-link">Đổi thưởng</Link></li>
                            <li><Link to="/about" className="footer-link">Liên hệ</Link></li>
                        </ul>
                    </Col>

                    {/* --- For Teachers --- */}
                    <Col xs={6} md={3}>
                        <h6 className="fw-semibold mb-3">For Teachers</h6>
                        <ul className="list-unstyled text-white-50">
                            <li><Link to="/seller/quizzes/create" className="footer-link">Tạo câu đố</Link></li>
                            <li><Link to="/seller" className="footer-link">Bảng điều khiển</Link></li>
                            <li><Link to="#" className="footer-link">Hướng dẫn</Link></li>
                            <li><Link to="#" className="footer-link">Blog</Link></li>
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
