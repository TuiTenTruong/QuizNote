import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaShoppingCart, FaLock, FaCreditCard } from "react-icons/fa";
import "./QuizPayment.scss";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getQuizDetail, VNPayCreateOrder } from "../../services/apiService";
import axiosInstance from "../../utils/axiosCustomize"
import { useSelector } from "react-redux";
const QuizPayment = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const location = useLocation();
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";
    const user = useSelector((state) => state.user.account);
    useEffect(() => {
        const state = location.state;
        if (state?.quiz) {
            // Kiểm tra status ngay khi có data từ state
            if (state.quiz.status === 'INACTIVE') {
                toast.error("Môn học này hiện không khả dụng để mua.");
                navigate('/student/quizzes');
                return;
            }
            setQuizData(state.quiz);
        } else {
            const quizId = location.pathname.split("/").pop();
            const fetchQuizById = async (quizId) => {
                const response = await getQuizDetail(quizId);
                return response.data;
            };
            fetchQuizById(quizId).then((data) => {
                if (data) {
                    // Kiểm tra status khi fetch từ API
                    if (data.status === 'INACTIVE') {
                        toast.error("Môn học này hiện không khả dụng để mua.");
                        navigate('/student/quizzes');
                        return;
                    }
                    setQuizData(data);
                } else {
                    console.error("Failed to fetch quiz:", data);
                }
            }).catch((error) => {
                console.error("Error fetching quiz:", error);
                toast.error("Không thể tải thông tin môn học. Vui lòng thử lại sau.");
                navigate('/student/quizzes');
            });
        }
    }, [location, navigate]);

    const handleVNPayPayment = async () => {
        if (!quizData) return;

        // Kiểm tra nếu subject ở trạng thái INACTIVE thì không cho phép thanh toán
        if (quizData.status === 'INACTIVE') {
            toast.error("Môn học này hiện không khả dụng để mua. Vui lòng liên hệ quản trị viên.");
            navigate('/student/quizzes');
            return;
        }

        setLoading(true);
        try {
            const response = await VNPayCreateOrder(quizData.price || 0, `buyer:${user.id};subject:${quizData.id}`);
            const url = response.data || response;

            console.log("VNPay URL:", url);

            if (url && typeof url === 'string' && url.startsWith('http')) {
                window.location.href = url;
            } else {
                console.error("Invalid payment URL:", url);
                throw new Error("Invalid payment URL received");
            }
        } catch (error) {
            console.error("Error creating VNPay order:", error);
            toast.error("Lỗi khi tạo đơn hàng VNPay. Vui lòng thử lại!");
        } finally {
            setLoading(false);
        }
    };

    if (!quizData) {
        return (
            <div className="payment-page">
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="light" />
                    <p className="text-light mt-3">Đang tải thông tin...</p>
                </Container>
            </div>
        );
    }

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
                                    src={backendBaseURL + quizData.imageUrl}
                                    alt="quiz"
                                    className="rounded-3"
                                    width={100}
                                    height={70}
                                    style={{ objectFit: "cover" }}
                                />
                                <div>
                                    <h6 className="fw-semibold mb-1">{quizData.name}</h6>
                                    <small className="text-secondary">
                                        {quizData.createUser?.username || "Unknown"}
                                    </small>
                                </div>
                            </div>

                            {/* Price Section */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <span>Giá quiz</span>
                                    <span>{(quizData.price || 0).toLocaleString("vi-VN")} ₫</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Phí giao dịch</span>
                                    <span>Miễn phí</span>
                                </div>
                                <hr className="border-secondary" />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Tổng thanh toán</span>
                                    <span className="text-gradient">
                                        {(quizData.price || 0).toLocaleString("vi-VN")} ₫
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
                                variant="outline-light btn-gradient p-2"
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
