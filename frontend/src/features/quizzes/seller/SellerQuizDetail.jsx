import { Container, Row, Col, Card, Button, Table, ProgressBar, Badge } from "react-bootstrap";
import {
    FaClock,
    FaUserGraduate,
    FaTrophy,
    FaEdit,
    FaShareAlt,
    FaEye,
    FaMoneyBillWave,
    FaShoppingCart,
    FaChartBar,
    FaTrash,
    FaStar,
    FaReply
} from "react-icons/fa";
import "./SellerQuizDetail.scss";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosCustomize";
import ReviewItem from "../student/ReviewItem";
import { getQuizDetail, getQuizDemo, getQuizReviews, sellerGetRecentOrders, replyComment } from "../../../services/apiService";
import { toast } from "react-toastify";

function SellerQuizDetail() {
    const [quiz, setQuiz] = useState(null);
    const [quizDemo, setQuizDemo] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsPage, setReviewsPage] = useState(0);
    const [maxReviews, setMaxReviews] = useState(0);
    const [countReviews, setCountReviews] = useState(0);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [recentOrders, setRecentOrders] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const { quizId } = useParams();
    const navigate = useNavigate();
    const backendBaseSubjectURL = axiosInstance.defaults.baseURL + "storage/subjects/";
    const backendBaseUserURL = axiosInstance.defaults.baseURL + "storage/users/";

    useEffect(() => {
        // Fetch quiz detail from API
        const fetchQuizDetail = async () => {
            const response = await getQuizDetail(quizId);
            if (response && response.statusCode === 200) {
                setQuiz(response.data);
            } else {
                console.error("Failed to fetch quiz detail", response);
            }
        };
        fetchQuizDetail();
    }, [quizId]);

    useEffect(() => {
        const fetchQuizDemo = async () => {
            const response = await getQuizDemo(quizId);
            if (response && response.statusCode === 200) {
                setQuizDemo(response.data);
            } else {
                console.error("Failed to fetch quiz demo", response);
            }
        };
        fetchQuizDemo();
    }, [quizId]);

    // Fetch reviews
    const fetchReviews = async (page) => {
        if (!hasMoreReviews && page > 0) return;
        setReviewsLoading(true);
        const res = await getQuizReviews(quizId, page, 5);
        if (res && res.statusCode === 200) {
            setReviews(prev => [...prev, ...res.data.result]);
            setReviewsPage(page);
            setHasMoreReviews(!res.data.last);
            setMaxReviews(res.data.meta.pages);
            setCountReviews(res.data.meta.total);
        } else {
            console.error("Failed to fetch reviews");
        }
        setReviewsLoading(false);
    };

    useEffect(() => {
        if (quizId) {
            fetchReviews(0);
        }
    }, [quizId]);

    useEffect(() => {
        const fetchRecentOrders = async () => {
            if (quizId) {
                const response = await sellerGetRecentOrders(quizId);
                if (response && response.statusCode === 200) {

                    setRecentOrders(response.data);
                } else {
                    console.error("Failed to fetch recent orders", response);
                }
            }
        };
        if (quiz) {
            fetchRecentOrders();
        }
    }, [quiz, quizId]);

    const handleLoadMoreReviews = () => {
        fetchReviews(reviewsPage + 1);
    };

    const handleEditQuiz = () => {
        navigate(`/seller/detail/${quizId}`);
    };

    const handleDeleteQuiz = () => {
        if (window.confirm("Bạn có chắc chắn muốn xóa quiz này?")) {
            // Implement delete functionality
            console.log("Delete quiz:", quizId);
        }
    };

    const handleReplyClick = (reviewId) => {
        setReplyingTo(reviewId);
        setReplyContent("");
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setReplyContent("");
    };

    const handleSubmitReply = async (reviewId) => {
        if (!replyContent.trim()) {
            toast.error("Vui lòng nhập nội dung phản hồi");
            return;
        }

        const response = await replyComment(reviewId, replyContent);
        if (response && response.statusCode === 200) {
            toast.success("Phản hồi đã được gửi thành công");
        } else {
            toast.error("Có lỗi xảy ra khi gửi phản hồi");
            console.error("Failed to send reply", response);
        }


        // Reset state after submission
        setReplyingTo(null);
        setReplyContent("");

        fetchReviews(0);
    };

    if (!quiz) {
        return <div className="text-center text-light p-5">Loading quiz details...</div>;
    }

    const totalRevenue = quiz.price * quiz.purchaseCount;

    return (
        <div className="seller-quiz-detail">
            <Container fluid="sm">
                {/* HEADER */}
                <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <h3 className="fw-bold text-gradient mb-1">{quiz.name}</h3>
                        <p className="text-secondary">{quiz.description}</p>
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        <Button variant="outline-light" size="sm" onClick={handleEditQuiz}>
                            <FaEdit className="me-1" /> Chỉnh sửa
                        </Button>
                        <Button variant="danger" size="sm" onClick={handleDeleteQuiz}>
                            <FaTrash className="me-1" /> Xóa
                        </Button>
                    </div>
                </div>

                {/* STATS */}
                <Row className="g-3 mb-4">
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaShoppingCart className="icon text-info mb-2" />
                            <h4 className="fw-bold text-white">{quiz.purchaseCount}</h4>
                            <p className="text-secondary small mb-0">Lượt mua</p>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaMoneyBillWave className="icon text-success mb-2" />
                            <h4 className="fw-bold text-white">{totalRevenue.toLocaleString("vi-VN")} ₫</h4>
                            <p className="text-secondary small mb-0">Tổng doanh thu</p>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaStar className="icon text-warning mb-2" />
                            <h4 className="fw-bold text-white">{quiz.ratingCount}</h4>
                            <p className="text-secondary small mb-0">Tổng số đánh giá</p>
                        </Card>
                    </Col>
                    <Col xs={6} md={3}>
                        <Card className="stat-card bg-dark border-0 text-center p-3 shadow-sm">
                            <FaTrophy className="icon text-danger mb-2" />
                            <h4 className="fw-bold text-white">{quiz.highestScore || 0}đ</h4>
                            <p className="text-secondary small mb-0">Điểm cao nhất</p>
                        </Card>
                    </Col>
                </Row>

                {/* RECENT BUYERS & PERFORMANCE */}
                <Row className="g-4 mb-4">
                    <Col xs={12} lg={7}>
                        <Card className="bg-dark border-0 p-3 shadow-sm h-100">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="fw-semibold text-white mb-0">Người mua gần đây</h6>
                            </div>
                            {recentOrders.length > 0 ? (
                                <Table borderless variant="dark" className="align-middle mb-0">
                                    <thead>
                                        <tr className="text-secondary small">
                                            <th>Người mua</th>
                                            <th>Email</th>
                                            <th>Ngày</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order, i) => (
                                            <tr key={i}>
                                                <td>{order.buyer}</td>
                                                <td>{order.buyerEmail}</td>
                                                <td>{order.purchaseDate}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-secondary">Chưa có người mua nào.</p>
                            )}
                        </Card>
                    </Col>

                    <Col xs={12} lg={5}>
                        <Card className="bg-dark border-0 p-3 shadow-sm h-100">
                            <h6 className="fw-semibold text-white mb-3">Câu hỏi mẫu</h6>
                            {(quizDemo !== null && quizDemo.length > 0) ? quizDemo.map((question, i) => (
                                <div key={i} className="mb-3">
                                    <p className="small text-light mb-1">
                                        {i + 1}. {question.content}
                                    </p>
                                    <ProgressBar
                                        now={question.correctnessPercentage}
                                        label={`${question.correctnessPercentage}%`}
                                        className="progress-custom"
                                        variant="purple"
                                    />
                                </div>
                            )) : <p className="text-secondary">Không có câu hỏi mẫu nào.</p>}
                        </Card>
                    </Col>
                </Row>

                {/* QUIZ INFO & REVIEWS */}
                <Row className="g-4 mb-4">
                    <Col xs={12}>
                        <Card className="bg-dark border-0 p-4 shadow-sm">
                            <h6 className="fw-semibold text-white mb-3">Thông tin Quiz</h6>
                            <Row>
                                <Col md={6}>
                                    <p className="text-light mb-2">
                                        <strong>Giá bán:</strong> <span className="text-gradient fw-bold">
                                            {quiz.price > 0 ? `${quiz.price.toLocaleString("vi-VN")} ₫` : "Miễn phí"}
                                        </span>
                                    </p>
                                    <p className="text-light mb-2">
                                        <strong>Số câu hỏi:</strong> {quiz.questionCount || 0}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p className="text-light mb-2">
                                        <strong>Đánh giá trung bình:</strong> ★ {quiz.averageRating.toFixed(1)} / 5
                                    </p>
                                    <p className="text-light mb-2">
                                        <strong>Trạng thái:</strong>{" "}
                                        <Badge bg={quiz.status === 'ACTIVE' ? 'success' : quiz.status === 'PENDING' ? 'warning' : 'secondary'}>
                                            {quiz.status}
                                        </Badge>
                                    </p>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* REVIEWS */}
                <Card className="bg-dark border-0 p-4 shadow-sm">
                    <h6 className="fw-semibold text-white mb-3">
                        Đánh giá từ học viên {countReviews > 0 && `(${countReviews})`}
                    </h6>
                    {reviews.length > 0 ? reviews.map((r, i) => (
                        <div key={r.id}>
                            <ReviewItem
                                review={r}
                                canReply={true}
                                replyingTo={replyingTo}
                                replyContent={replyContent}
                                onReplyClick={handleReplyClick}
                                onCancelReply={handleCancelReply}
                                onSubmitReply={handleSubmitReply}
                                onReplyContentChange={setReplyContent}
                            />
                            {i < reviews.length - 1 && <hr className="text-secondary opacity-25" />}
                        </div>
                    )) : <p className="text-secondary">Chưa có đánh giá nào.</p>}

                    {reviewsLoading && <div className="text-center text-secondary">Đang tải...</div>}

                    {hasMoreReviews && !reviewsLoading && (
                        <div className="text-center mt-3">
                            {(reviewsPage < maxReviews - 1) ? (
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={handleLoadMoreReviews}
                                >
                                    Xem thêm đánh giá
                                </Button>
                            ) : (
                                <span className="text-secondary">Đã tải hết đánh giá.</span>
                            )}
                        </div>
                    )}
                </Card>
            </Container>
        </div>
    );
}

export default SellerQuizDetail;
