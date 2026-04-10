import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaShoppingCart, FaLock, FaCreditCard } from "react-icons/fa";
import axiosInstance from "../../utils/axiosCustomize";
import { useCreateVNPayOrderMutation, useQuizPaymentSubjectQuery } from "../../hooks/usePayment";
import "./scss/StudentQuizPaymentSection.scss";

interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}

export const StudentQuizPaymentSection: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { quizId } = useParams<{ quizId: string }>();
    const quizIdNumber = Number(quizId);

    const backendBaseURL = `${axiosInstance.defaults.baseURL}storage/subjects/`;
    const user = useSelector((state: RootState) => state.user?.account);

    const { quizData, loading, error } = useQuizPaymentSubjectQuery(quizIdNumber, location.state);
    const { loading: creatingOrder, createOrderUrl } = useCreateVNPayOrderMutation();

    useEffect(() => {
        if (!loading && error) {
            toast.error(error);
            navigate("/student/quizzes");
        }
    }, [error, loading, navigate]);

    useEffect(() => {
        if (!loading && quizData?.status === "INACTIVE") {
            toast.error("Mon hoc nay hien khong kha dung de mua.");
            navigate("/student/quizzes");
        }
    }, [loading, navigate, quizData]);

    const handleVNPayPayment = async () => {
        if (!quizData || !user?.id) {
            toast.error("Khong tim thay thong tin thanh toan.");
            return;
        }

        if (quizData.status === "INACTIVE") {
            toast.error("Mon hoc nay hien khong kha dung de mua. Vui long lien he quan tri vien.");
            navigate("/student/quizzes");
            return;
        }

        const paymentUrl = await createOrderUrl(quizData.price || 0, `buyer:${user.id};subject:${quizData.id}`);

        if (paymentUrl) {
            window.location.href = paymentUrl;
            return;
        }

        toast.error("Loi khi tao don hang VNPay. Vui long thu lai!");
    };

    if (loading || !quizData) {
        return (
            <div className="payment-page">
                <Container className="py-5 text-center">
                    <Spinner animation="border" variant="light" />
                    <p className="text-light mt-3">Dang tai thong tin...</p>
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
                                <h4 className="fw-bold text-gradient">Xac nhan thanh toan</h4>
                                <p className="text-secondary">
                                    Vui long kiem tra lai thong tin truoc khi thanh toan.
                                </p>
                            </div>

                            <div className="d-flex gap-3 align-items-center border-bottom border-secondary pb-3 mb-3">
                                <img
                                    src={`${backendBaseURL}${quizData.imageUrl}`}
                                    alt="quiz"
                                    className="rounded-3"
                                    width={100}
                                    height={70}
                                    style={{ objectFit: "cover" }}
                                />
                                <div>
                                    <h6 className="fw-semibold mb-1">{quizData.name}</h6>
                                    <small className="text-secondary">
                                        {quizData.createUser?.name || "Unknown"}
                                    </small>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="d-flex justify-content-between">
                                    <span>Gia quiz</span>
                                    <span>{(quizData.price || 0).toLocaleString("vi-VN")} VND</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span>Phi giao dich</span>
                                    <span>Mien phi</span>
                                </div>
                                <hr className="border-secondary" />
                                <div className="d-flex justify-content-between fw-bold">
                                    <span>Tong thanh toan</span>
                                    <span className="text-gradient">
                                        {(quizData.price || 0).toLocaleString("vi-VN")} VND
                                    </span>
                                </div>
                            </div>

                            <div className="text-center">
                                <Button
                                    className="btn-gradient w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                                    onClick={() => void handleVNPayPayment()}
                                    disabled={creatingOrder}
                                >
                                    {creatingOrder ? (
                                        <>
                                            <Spinner animation="border" size="sm" /> Dang khoi tao VNPay...
                                        </>
                                    ) : (
                                        <>
                                            <FaCreditCard /> Thanh toan qua VNPay
                                        </>
                                    )}
                                </Button>
                                <div className="mt-3 text-secondary small">
                                    <FaLock className="me-1" /> Giao dich bao mat boi VNPay.
                                </div>
                            </div>
                        </Card>

                        <div className="text-center mt-4">
                            <Button
                                variant="outline-light btn-gradient p-2"
                                size="sm"
                                onClick={() => navigate(-1)}
                            >
                                Quay lai
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};
