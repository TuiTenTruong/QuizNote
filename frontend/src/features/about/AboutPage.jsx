import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaStar, FaUsers, FaBookOpen, FaBolt } from "react-icons/fa";
import "./AboutPage.scss";
import { useNavigate } from "react-router-dom";
const AboutPage = () => {
    const navigate = useNavigate();
    return (
        <div className="about-page">
            <Container className="py-5">
                {/* Hero */}
                <Row className="align-items-center mb-5 g-4">
                    <Col md={7}>
                        <h1 className="fw-bold text-gradient mb-3">Về QuizNote</h1>
                        <p className="text-muted lead mb-3">
                            QuizNote là nền tảng bán đề cương ôn tập và luyện thi trắc nghiệm trực tuyến,
                            giúp sinh viên biến tài liệu thành điểm số một cách dễ dàng và thú vị.
                        </p>
                        <p className="text-muted">
                            Tại đây, bạn có thể mua đề cương chất lượng, luyện quiz, làm Weekly Quiz nhận xu,
                            và đổi thưởng bằng chính nỗ lực học tập của mình.
                        </p>
                        <div className="d-flex flex-wrap gap-3 mt-3">
                            <div className="highlight-pill">
                                <FaBookOpen className="me-2" />
                                Đề cương chất lượng
                            </div>
                            <div className="highlight-pill">
                                <FaBolt className="me-2" />
                                Quiz & Weekly thử thách
                            </div>
                            <div className="highlight-pill">
                                <FaStar className="me-2" />
                                Đổi thưởng bằng xu
                            </div>
                        </div>
                    </Col>
                    <Col md={5}>
                        <Card className="about-summary-card">
                            <Card.Body>
                                <h5 className="fw-semibold mb-3 text-light">Sứ mệnh</h5>
                                <p className="text-muted mb-0">
                                    Cung cấp một môi trường ôn tập hiện đại, minh bạch, nơi sinh viên có thể
                                    dễ dàng tìm tài liệu tốt, luyện tập thường xuyên và theo dõi tiến bộ của bản thân.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Stats */}
                <Row className="g-4 mb-5">
                    <Col md={4}>
                        <Card className="stat-card">
                            <Card.Body className="d-flex align-items-center">
                                <div className="stat-icon me-3">
                                    <FaUsers />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0 text-light">3 nhóm người dùng</h4>
                                    <p className="text-muted small mb-0">
                                        Học viên, người bán tài liệu và admin kết nối trên một nền tảng chung.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="stat-card">
                            <Card.Body className="d-flex align-items-center">
                                <div className="stat-icon me-3">
                                    <FaBookOpen />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0 text-light">Marketplace học liệu</h4>
                                    <p className="text-muted small mb-0">
                                        Mua – bán đề cương, bộ câu hỏi, tài liệu ôn tập theo từng môn học.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="stat-card">
                            <Card.Body className="d-flex align-items-center">
                                <div className="stat-icon me-3">
                                    <FaBolt />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0 text-light">Thi & Weekly Quiz</h4>
                                    <p className="text-muted small mb-0">
                                        Thi trắc nghiệm, Weekly 1 lần/tuần, nhận xu và đổi quà.
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Sections */}
                <Row className="g-4">
                    <Col md={6}>
                        <Card className="feature-card">
                            <Card.Body>
                                <h5 className="fw-semibold mb-3 text-light">QuizNote dành cho ai?</h5>
                                <ul className="text-muted mb-0">
                                    <li>Sinh viên muốn ôn tập theo học phần, luyện đề trước kỳ thi.</li>
                                    <li>Người bán tài liệu muốn chia sẻ đề cương, bộ câu hỏi và nhận hoa hồng.</li>
                                    <li>Giảng viên hoặc trợ giảng muốn tổ chức bài kiểm tra trắc nghiệm nhanh chóng.</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="feature-card">
                            <Card.Body>
                                <h5 className="fw-semibold mb-3 text-light">Điểm khác biệt</h5>
                                <ul className="text-muted mb-0">
                                    <li>Kết hợp marketplace tài liệu với hệ thống thi trắc nghiệm trực tuyến.</li>
                                    <li>Cơ chế xu thưởng từ Weekly Quiz và hệ thống đổi thưởng gamification.</li>
                                    <li>Phân quyền rõ ràng: học viên, seller, admin với dashboard riêng.</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* CTA */}
                <Row className="mt-5">
                    <Col className="text-center">
                        <Card className="cta-card d-inline-block px-4 py-3">
                            <Card.Body>
                                <h5 className="fw-semibold mb-2 text-light">Bắt đầu với QuizNote ngay hôm nay</h5>
                                <p className="text-muted mb-3">
                                    Đăng ký tài khoản, chọn môn học, luyện quiz và tích xu đổi quà mỗi tuần.
                                </p>
                                <Button className="btn-gradient px-4" onClick={() => navigate("/register")}>
                                    Tạo tài khoản
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AboutPage;
