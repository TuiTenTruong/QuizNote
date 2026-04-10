import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Container, Card, Button } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle, FaReceipt } from "react-icons/fa";
import { toast } from "react-toastify";
import {
    extractSubjectIdFromOrderInfo,
    formatVNPayPaymentTime,
    usePaymentResultState,
} from "../../hooks/usePayment";
import "./scss/StudentPaymentResultSection.scss";

export const StudentPaymentResultSection: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentData = usePaymentResultState(searchParams);

    useEffect(() => {
        if (!paymentData.status && paymentData.responseCode) {
            let message = "Giao dich khong thanh cong.";
            if (paymentData.responseCode === "24") {
                message = "Giao dich da bi huy.";
            } else if (paymentData.responseCode === "51") {
                message = "Tai khoan khong du so du.";
            } else if (paymentData.responseCode === "11") {
                message = "Da het han cho thanh toan.";
            }
            toast.warning(message);
        }
    }, [paymentData.responseCode, paymentData.status]);

    const handleGoToMyQuizzes = () => {
        navigate("/student/quizzes/my");
    };

    const handleGoToHome = () => {
        navigate("/student");
    };

    const handleRetry = () => {
        const subjectId = extractSubjectIdFromOrderInfo(paymentData.orderInfo);
        if (subjectId) {
            navigate(`/student/quiz-payment/${subjectId}`);
            return;
        }

        navigate("/student");
    };

    return (
        <div className="payment-result-page">
            <Container className="py-5">
                <div className="d-flex justify-content-center">
                    <Card className="payment-result-card bg-dark text-light border-0 shadow-lg p-4">
                        <div className="text-center mb-4">
                            {paymentData.status ? (
                                <>
                                    <FaCheckCircle size={80} className="text-success mb-3" />
                                    <h3 className="fw-bold text-success">Thanh toan thanh cong!</h3>
                                    <p className="text-secondary">
                                        Giao dich cua ban da duoc xu ly thanh cong.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle size={80} className="text-danger mb-3" />
                                    <h3 className="fw-bold text-danger">Thanh toan that bai!</h3>
                                    <p className="text-secondary">
                                        Giao dich khong thanh cong. Vui long thu lai.
                                    </p>
                                </>
                            )}
                        </div>

                        {paymentData.status && (
                            <div className="payment-details">
                                <div className="detail-header mb-3">
                                    <FaReceipt className="me-2" />
                                    <strong>Thong tin giao dich</strong>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Ma giao dich:</span>
                                    <span className="fw-semibold">{paymentData.transactionNo}</span>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">So tien:</span>
                                    <span className="fw-semibold text-gradient">
                                        {paymentData.amount.toLocaleString("vi-VN")} VND
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Thoi gian:</span>
                                    <span className="fw-semibold">
                                        {formatVNPayPaymentTime(paymentData.paymentTime)}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span className="text-secondary">Phuong thuc:</span>
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
                                        Xem quiz da mua
                                    </Button>
                                    <Button
                                        variant="outline-light"
                                        className="w-100 py-2"
                                        onClick={handleGoToHome}
                                    >
                                        Ve trang chu
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        className="btn-gradient w-100 py-2"
                                        onClick={handleRetry}
                                    >
                                        Thu lai
                                    </Button>
                                    <Button
                                        variant="outline-light"
                                        className="w-100 py-2"
                                        onClick={handleGoToHome}
                                    >
                                        Ve trang chu
                                    </Button>
                                </>
                            )}
                        </div>
                    </Card>
                </div>
            </Container>
        </div>
    );
};
