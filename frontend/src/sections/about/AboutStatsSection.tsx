import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaUsers, FaBookOpen, FaBolt } from "react-icons/fa";
import styles from "./AboutStatsSection.module.scss";

const AboutStatsSection = () => {
    return (
        <section className={styles.statsSection}>
            <Container>
                <Row className="g-4 mb-5">
                    <Col md={4}>
                        <div className={styles.statCard}>
                            <div className="d-flex align-items-center">
                                <div className={`${styles.statIcon} me-3`}>
                                    <FaUsers />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0 text-light">3 nhóm người dùng</h4>
                                    <p className={`${styles.textMuted} small mb-0`}>
                                        Học viên, người bán tài liệu và admin kết nối trên một nền tảng chung.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className={styles.statCard}>
                            <div className="d-flex align-items-center">
                                <div className={`${styles.statIcon} me-3`}>
                                    <FaBookOpen />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0 text-light">Marketplace học liệu</h4>
                                    <p className={`${styles.textMuted} small mb-0`}>
                                        Mua – bán đề cương, bộ câu hỏi, tài liệu ôn tập theo từng môn học.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col md={4}>
                        <div className={styles.statCard}>
                            <div className="d-flex align-items-center">
                                <div className={`${styles.statIcon} me-3`}>
                                    <FaBolt />
                                </div>
                                <div>
                                    <h4 className="fw-bold mb-0 text-light">Thi & Weekly Quiz</h4>
                                    <p className={`${styles.textMuted} small mb-0`}>
                                        Thi trắc nghiệm, Weekly 1 lần/tuần, nhận xu và đổi quà.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutStatsSection;