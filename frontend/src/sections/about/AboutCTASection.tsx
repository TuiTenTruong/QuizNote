import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styles from "./AboutCTASection.module.scss";

const AboutCTASection = () => {
    const navigate = useNavigate();

    return (
        <section className={styles.ctaSection}>
            <Container>
                <Row className="mt-5">
                    <Col className="text-center">
                        <div className={`${styles.ctaCard} d-inline-block px-4 py-3`}>
                            <h5 className="fw-semibold mb-2 text-light">Bắt đầu với QuizNote ngay hôm nay</h5>
                            <p className={`${styles.textMuted} mb-3`}>
                                Đăng ký tài khoản, chọn môn học, luyện quiz và tích xu đổi quà mỗi tuần.
                            </p>
                            <Button className={styles.btnGradient} onClick={() => navigate("/register")}>
                                Tạo tài khoản
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default AboutCTASection;