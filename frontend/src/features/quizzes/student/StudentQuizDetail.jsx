import {
    Container,
    Row,
    Col,
    Button,
    Badge,
    Card,
    ProgressBar,
    Form,
    Alert,
} from "react-bootstrap";
import {
    FaClock,
    FaBookOpen,
    FaStar,
    FaUser,
    FaChartLine,
    FaUserGraduate,
    FaShoppingCart,
} from "react-icons/fa";
import "./StudentQuizDetail.scss";
import { useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosCustomize";
import ReviewItem from "./ReviewItem"; // Import component mới
import { getQuizDetail, getQuizDemo, getQuizReviews, createComment, getMyRatings } from "../../../services/apiService";
import { useLocation } from "react-router-dom";
import { navigateToSelectMode } from "../../../utils/quizNavigation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const StudentQuizDetail = () => {
    const [quiz, setQuiz] = useState(null);
    const [quizDemo, setQuizDemo] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsPage, setReviewsPage] = useState(0);
    const [maxReviews, setMaxReviews] = useState(0);
    const [countReviews, setCountReviews] = useState(0);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewContent, setReviewContent] = useState("");
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitMessage, setSubmitMessage] = useState(null);
    const { quizId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const account = useSelector(state => state.user.account);
    const [isRating, setIsRating] = useState(false);
    const backendBaseSubjectURL = axiosInstance.defaults.baseURL + "storage/subjects/";
    const backendBaseUserURL = axiosInstance.defaults.baseURL + "storage/users/";
    const hasPurchased = location.state?.hasPurchased || false;
    const isAuthenticated = account && account.id;
    console.log("Has purchased:", hasPurchased);

    useEffect(() => {
        // Fetch quiz detail from API
        const fetchQuizDetail = async () => {
            try {
                const response = await getQuizDetail(quizId);
                if (response && response.statusCode === 200) {
                    setQuiz(response.data);
                } else {
                    console.error("Failed to fetch quiz detail", response);
                }
            } catch (error) {
                console.error("Error fetching quiz detail:", error);
                // Nếu là subject INACTIVE và chưa mua, backend sẽ trả error
                alert("Không thể truy cập môn học này. Môn học có thể đã được ẩn hoặc không tồn tại.");
                navigate('/');
            }
        };
        fetchQuizDetail();
    }, [quizId, navigate]);
    useEffect(() => {
        const fetchMyRatings = async () => {
            if (!isAuthenticated) return;

            const response = await getMyRatings(account.id, quizId);
            if (response && response.statusCode === 200) {
                setIsRating(response.data);
            } else {
                console.error("Failed to fetch my ratings", response);
            }
        };
        fetchMyRatings();
    }, [isAuthenticated, account, quizId]);
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

    const handleLoadMoreReviews = () => {
        fetchReviews(reviewsPage + 1);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewContent.trim()) {
            setSubmitMessage({ type: 'danger', text: 'Vui lòng nhập nội dung đánh giá!' });
            return;
        }

        setSubmitLoading(true);
        setSubmitMessage(null);

        try {
            const response = await createComment(quizId, reviewContent, rating);
            if (response && response.statusCode === 201) {
                setSubmitMessage({ type: 'success', text: 'Đánh giá của bạn đã được gửi thành công!' });
                setIsRating(true);
                setReviewContent("");
                setRating(5);
                // Refresh reviews
                setReviews([]);
                setReviewsPage(0);
                setHasMoreReviews(true);
                fetchReviews(0);
            } else {
                setSubmitMessage({ type: 'danger', text: 'Có lỗi xảy ra. Vui lòng thử lại!' });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            setSubmitMessage({ type: 'danger', text: 'Có lỗi xảy ra. Vui lòng thử lại!' });
        } finally {
            setSubmitLoading(false);

        }
    };

    if (!quiz) {
        return <div className="text-center text-light p-5">Loading quiz details...</div>;
    } return (
        <div className="student-quiz-detail w-100">
            {/* HEADER BANNER */}
            <div
                className="quiz-banner"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${backendBaseSubjectURL + quiz.imageUrl})`,
                }}
            >
                <Container className="py-5 text-white">
                    <Row>
                        <Col md={8}>
                            <h2 className="fw-bold">{quiz.name}</h2>
                            <p className="text-light text-ellipsis">{quiz.description}</p>
                            <div className="d-flex flex-wrap gap-3 mt-3 small text-white-50">
                                <span className="d-flex align-items-center">
                                    <FaUserGraduate className="me-1" /> {quiz.purchaseCount} học viên
                                </span>
                                <span className="text-warning d-flex align-items-center">
                                    <FaStar className="me-1" /> {quiz.averageRating.toFixed(1)} / 5
                                </span>
                            </div>
                        </Col>

                        <Col
                            md={4}
                            className="d-flex flex-column align-items-md-end justify-content-center mt-4 mt-md-0"
                        >
                            <h4 className="text-gradient fw-bold mb-2">
                                {quiz.price > 0
                                    ? `${quiz.price.toLocaleString("vi-VN")} ₫`
                                    : "Miễn phí"}
                            </h4>

                            {!isAuthenticated ? (
                                <Button
                                    className="btn-gradient w-100"
                                    onClick={() => navigate('/login', { state: { from: `/student/quizzes/${quiz.id}` } })}
                                >
                                    Đăng nhập để tiếp tục
                                </Button>
                            ) : quiz.price == 0 || hasPurchased ? (
                                <Button className="btn-gradient w-100" onClick={() => navigateToSelectMode(navigate, quiz)}>Bắt đầu làm bài</Button>
                            ) : (
                                <>
                                    <Button className="btn-gradient w-100" onClick={() => navigate(`/student/quiz-payment/${quiz.id}`, { state: { quiz: quiz } })}><FaShoppingCart className="me-2" /> Mua Quiz</Button>
                                </>
                            )}

                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="py-5">
                <Row className="gy-4">
                    {/* MAIN CONTENT */}
                    <Col lg={8}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-4">
                            <h5 className="fw-bold mb-3">Tổng quan quiz</h5>
                            <p className="text-secondary mb-0">{quiz.description}</p>
                        </Card>

                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-4">
                            <h5 className="fw-bold mb-3">Câu hỏi mẫu</h5>
                            {console.log(quizDemo)}
                            {(quizDemo !== null && quizDemo.length > 0) ? quizDemo.map((question, i) => (
                                <div key={i} className="sample-question mb-3">
                                    <strong>{i + 1}. </strong> {question.content}
                                    <ProgressBar
                                        now={question.correctnessPercentage}
                                        variant="purple"
                                        className="mt-2"
                                    />
                                </div>
                            )) : <p className="text-secondary">Không có câu hỏi mẫu nào.</p>}
                        </Card>

                        <Card className="bg-dark text-light border-0 shadow-sm p-4">
                            <h5 className="fw-bold mb-3">Đánh giá từ học viên {countReviews > 0 && `(${countReviews})`}</h5>

                            {/* Review Form - Only show if user is authenticated and has purchased */}
                            {isAuthenticated && (!isRating) && (quiz.price === 0 || hasPurchased) && (
                                <Card className="bg-secondary bg-opacity-25 border-0 p-3 mb-4">
                                    <h6 className="fw-semibold mb-3 text-white">Đánh giá của bạn</h6>
                                    <Form onSubmit={handleSubmitReview}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-light">Xếp hạng</Form.Label>
                                            <div className="d-flex gap-2 mb-2 align-items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        style={{ cursor: 'pointer', fontSize: '1.6rem' }}
                                                        className={star <= rating ? 'text-warning' : 'text-secondary'}
                                                    >
                                                        {star <= rating ? '★' : '☆'}
                                                    </span>
                                                ))}
                                                <span className="text-light ms-2 pt-1">{rating}/5</span>
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-light">Nội dung đánh giá</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                rows={3}
                                                value={reviewContent}
                                                onChange={(e) => setReviewContent(e.target.value)}
                                                placeholder="Chia sẻ trải nghiệm của bạn về quiz này..."
                                                className="bg-dark text-light border-secondary"
                                            />
                                        </Form.Group>

                                        {submitMessage && (
                                            <Alert variant={submitMessage.type} className="mb-3">
                                                {submitMessage.text}
                                            </Alert>
                                        )}

                                        <Button
                                            type="submit"
                                            variant="primary"
                                            className="btn-gradient"
                                            disabled={submitLoading}
                                        >
                                            {submitLoading ? 'Gửi đang...' : 'Gửi đánh giá'}
                                        </Button>
                                    </Form>
                                </Card>
                            )}

                            {reviews.length > 0 ? reviews.map((r, i) => (
                                <div key={r.id}>
                                    <ReviewItem review={r} />
                                    {i < reviews.length - 1 && <hr className="text-secondary opacity-25" />}
                                </div>
                            )) : <p className="text-secondary">Chưa có đánh giá nào.</p>}

                            {reviewsLoading && <div className="text-center text-secondary">Đang tải...</div>}

                            {hasMoreReviews && !reviewsLoading && (
                                <div className="text-center mt-3">
                                    {(reviewsPage < maxReviews - 1) ? <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={handleLoadMoreReviews}
                                    >
                                        Xem thêm đánh giá
                                    </Button> : <span className="text-secondary">Đã tải hết đánh giá.</span>}
                                </div>
                            )}
                        </Card>
                    </Col>

                    {/* SIDEBAR */}
                    <Col lg={4}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 sticky-md-top">
                            <div className="d-flex align-items-center mb-3">
                                {quiz.createUser.avatarUrl && (<img
                                    src={backendBaseUserURL + quiz.createUser.avatarUrl}
                                    alt="author"
                                    className="rounded-circle me-3"
                                    width={60}
                                    height={60}
                                />)}

                                <div>
                                    <h6 className="fw-bold mb-0 text-white">{quiz.createUser.username}</h6>
                                    <small className="text-secondary">Teacher</small>
                                </div>
                            </div>
                            {quiz.highestScore != undefined && (
                                <>

                                    <h6 className="fw-bold mb-2">Điểm cao nhất:</h6>
                                    <h3 className="text-success fw-bold mb-3">{quiz.highestScore}đ</h3>
                                </>
                            )}
                            <div className="d-flex flex-column gap-2">
                                <Button variant="outline-light" className="w-100">
                                    Xem bảng xếp hạng
                                </Button>
                                <Button variant="outline-secondary" className="w-100">
                                    Lưu vào danh sách
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div >
    );
}

export default StudentQuizDetail;
