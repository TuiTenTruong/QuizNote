import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Card, Spinner, Button } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaReceipt } from "react-icons/fa";
import "./PaymentResult.scss";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [paymentData, setPaymentData] = useState(null);

    useEffect(() => {
        // Lấy thông tin từ URL params
        const status = searchParams.get("status");
        const orderInfo = searchParams.get("orderInfo");
        const transactionNo = searchParams.get("transactionNo");
        const amount = searchParams.get("amount");
        const paymentTime = searchParams.get("paymentTime");

        setPaymentData({
            status: status === "success",
            orderInfo: orderInfo || "",
            transactionNo: transactionNo || "",
            amount: amount ? parseInt(amount) : 0,
            paymentTime: paymentTime || ""
        });

        setLoading(false);
    }, [searchParams]);

    const formatPaymentTime = (timeStr) => {
        if (!timeStr || timeStr.length !== 14) return timeStr;
        // Format: yyyyMMddHHmmss -> dd/MM/yyyy HH:mm:ss
        const year = timeStr.substring(0, 4);
        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6, 8);
        const hour = timeStr.substring(8, 10);
        const minute = timeStr.substring(10, 12);
        const second = timeStr.substring(12, 14);
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    };

    const handleGoToMyQuizzes = () => {
        navigate("/student/quizzes/my");
    };

    const handleGoToHome = () => {
        navigate("/student");
    };

    if (loading) {
        return (
            <div className="payment-result-page">
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="light" />
                    <p className="text-light mt-3">Đang xử lý kết quả thanh toán...</p>
                </Container>
            </div>
        );
    }

    return (
        <div className="payment-result-page">
            <Container className="py-5">
                <div className="d-flex justify-content-center">
                    <Card className="payment-result-card bg-dark text-light border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            {paymentData.status ? (
                                <>
                                    <FaCheckCircle size={80} className="text-success mb-3" />
                                    <h3 className="fw-bold text-success">Thanh toán thành công!</h3>
                                    <p className="text-secondary">
                                        Giao dịch của bạn đã được xử lý thành công.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle size={80} className="text-danger mb-3" />
                                    <h3 className="fw-bold text-danger">Thanh toán thất bại!</h3>
                                    <p className="text-secondary">
                                        Giao dịch không thành công. Vui lòng thử lại.
                                    </p>
                                </>
                            )}
                        </div>

                        {paymentData.status && (
                            <div className="payment-details">
                                <div className="detail-header mb-3">
                                    <FaReceipt className="me-2" />
                                    <strong>Thông tin giao dịch</strong>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Mã giao dịch:</span>
                                    <span className="fw-semibold">{paymentData.transactionNo}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Số tiền:</span>
                                    <span className="fw-semibold text-gradient">
                                        {paymentData.amount.toLocaleString("vi-VN")} ₫
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Thời gian:</span>
                                    <span className="fw-semibold">
                                        {formatPaymentTime(paymentData.paymentTime)}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Phương thức:</span>
                                    <span className="fw-semibold">VNPay</span>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 d-flex gap-2 flex-column">
                            {paymentData.status ? (
                                <>
                                    <Button
                                        className="btn-gradient w-100 py-2"
                                        onClick={handleGoToMyQuizzes}
                                    >
                                        Xem quiz đã mua
                                    </Button>
                                    <Button
                                        variant="outline-light"
                                        className="w-100 py-2"
                                        onClick={handleGoToHome}
                                    >
                                        Về trang chủ
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outline-light"
                                    className="w-100 py-2"
                                    onClick={() => navigate(-4)}
                                >
                                    Quay lại
                                </Button>
                            )}
                        </div>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default PaymentResult;
