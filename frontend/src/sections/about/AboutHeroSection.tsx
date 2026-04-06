import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaBookOpen, FaBolt, FaStar } from "react-icons/fa";
import styles from "./AboutHeroSection.module.scss";

const AboutHeroSection = () => {
    return (
        <section className={styles.heroSection}>
            <Container className="py-5">
                <Row className="align-items-center g-4">
                    <Col md={7}>
                        <h1 className="fw-bold text-gradient mb-3">Về QuizNote</h1>
                        <p className={`${styles.textMuted} lead mb-3`}>
                            QuizNote là nền tảng bán đề cương ôn tập và luyện thi trắc nghiệm trực tuyến,
                            giúp sinh viên biến tài liệu thành điểm số một cách dễ dàng và thú vị.
                        </p>
                        <p className={styles.textMuted}>
                            Tại đây, bạn có thể mua đề cương chất lượng, luyện quiz, làm Weekly Quiz nhận xu,
                            và đổi thưởng bằng chính nỗ lực học tập của mình.
                        </p>
                        <div className="d-flex flex-wrap gap-3 mt-3">
                            <div className={styles.highlightPill}>
                                <FaBookOpen className="me-2" />
                                Đề cương chất lượng
                            </div>
                            <div className={styles.highlightPill}>
                                <FaBolt className="me-2" />
                                Quiz & Weekly thử thách
                            </div>
                            <div className={styles.highlightPill}>
                                <FaStar className="me-2" />
                                Đổi thưởng bằng xu
                            </div>
                        </div>
                    </Col>
                    <Col md={5}>
                        <div className={styles.summaryCard}>
                            <h5 className="fw-semibold mb-3 text-light">Sứ mệnh</h5>
                            <p className={`${styles.textMuted} mb-0`}>
                                Cung cấp một môi trường ôn tập hiện đại, minh bạch, nơi sinh viên có thể
                                dễ dàng tìm tài liệu tốt, luyện tập thường xuyên và theo dõi tiến bộ của bản thân.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutHeroSection;