import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./AboutFeaturesSection.module.scss";

const AboutFeaturesSection = () => {
    return (
        <section className={styles.featuresSection}>
            <Container>
                <Row className="g-4">
                    <Col md={6}>
                        <div className={styles.featureCard}>
                            <h5 className="fw-semibold mb-3 text-light">QuizNote dành cho ai?</h5>
                            <ul className={styles.textMuted}>
                                <li>Sinh viên muốn ôn tập theo học phần, luyện đề trước kỳ thi.</li>
                                <li>Người bán tài liệu muốn chia sẻ đề cương, bộ câu hỏi và nhận hoa hồng.</li>
                                <li>Giảng viên hoặc trợ giảng muốn tổ chức bài kiểm tra trắc nghiệm nhanh chóng.</li>
                            </ul>
                        </div>
                    </Col>
                    <Col md={6}>
                        <div className={styles.featureCard}>
                            <h5 className="fw-semibold mb-3 text-light">Điểm khác biệt</h5>
                            <ul className={styles.textMuted}>
                                <li>Kết hợp marketplace tài liệu với hệ thống thi trắc nghiệm trực tuyến.</li>
                                <li>Cơ chế xu thưởng từ Weekly Quiz và hệ thống đổi thưởng gamification.</li>
                                <li>Phân quyền rõ ràng: học viên, seller, admin với dashboard riêng.</li>
                            </ul>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutFeaturesSection;