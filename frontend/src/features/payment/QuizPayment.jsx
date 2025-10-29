import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaShoppingCart, FaLock, FaCreditCard } from "react-icons/fa";
import "./QuizPayment.scss";

function QuizPayment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 👉 Giả lập quiz được mua (khi student chọn quiz)
    const quiz = {
        id: 5,
        title: "Phân loại động vật - Sinh học 7",
        author: "Nguyễn Văn A",
        price: 49000,
        thumbnail: "https://i.imgur.com/sbTQ0jR.jpg",
        description:
            "Bộ câu hỏi trắc nghiệm sinh học lớp 7 - phân loại động vật, ôn tập cuối kỳ.",
    };

    const handleVNPayPayment = async () => {
        setLoading(true);
        try {
            // Gọi API backend (Spring Boot) để tạo link VNPay
            const res = await fetch(
                `http://localhost:8080/api/v1/payments/vnpay/pay?amount=${quiz.price}&orderInfo=buyer:1;subject:${quiz.id}`
            );
            const url = await res.text();
            window.location.href = url; // chuyển đến sandbox VNPay
        } catch (error) {
            console.error("Error creating VNPay order:", error);
            alert("Lỗi khi tạo đơn hàng VNPay.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-page">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="bg-dark text-light border-0 shadow-lg p-4">
                            <div className="text-center mb-4">
                                <FaShoppingCart size={40} className="text-gradient mb-3" />
                                <h4 className="fw-bold text-gradient">Xác nhận thanh toán</h4>
                                <p className="text-secondary">
                                    Vui lòng kiểm tra lại thông tin trước khi thanh toán.
                                </p>
                            </div>

                            {/* Quiz Info */}
                            <div className="d-flex gap-3 align-items-center border-bottom border-secondary pb-3 mb-3">
                                <img
                                    src={quiz.thumbnail}
                                    alt="quiz"
                                    className="rounded-3"
                                    width={100}
                                    height={70}
                                    style={{ objectFit: "cover" }}
                                />
                                <div>
                                    <h6 className="fw-semibold mb-1">{quiz.title}</h6>
                                    <small className="text-secondary">{quiz.author}</small>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <span>Giá quiz</span>
                                    <span>{quiz.price.toLocaleString("vi-VN")} ₫</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Phí giao dịch</span>
                                    <span>Miễn phí</span>
                                </div>
                                <hr className="border-secondary" />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Tổng thanh toán</span>
                                    <span className="text-gradient">
                                        {quiz.price.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>
                            </div>

                            {/* VNPay Button */}
                            <div className="text-center">
                                <Button
                                    className="btn-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={handleVNPayPayment}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner animation="border" size="sm" /> Đang khởi tạo VNPay...
                                        </>
                                    ) : (
                                        <>
                                            <FaCreditCard /> Thanh toán qua VNPay
                                        </>
                                    )}
                                </Button>
                                <div className="mt-3 text-secondary small">
                                    <FaLock className="me-1" /> Giao dịch bảo mật bởi VNPay.
                                </div>
                            </div>
                        </Card>

                        <div className="text-center mt-4">
                            <Button
                                variant="outline-light"
                                size="sm"
                                onClick={() => navigate(-1)}
                            >
                                Quay lại
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default QuizPayment;
