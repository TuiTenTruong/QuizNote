import {
    Container,
    Row,
    Col,
    Button,
    Badge,
    Card,
    ProgressBar,
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
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosCustomize";
import ReviewItem from "./ReviewItem"; // Import component mới
import { getQuizDetail, getQuizDemo, getQuizReviews } from "../../../services/apiService";
const StudentQuizDetail = () => {
    const [quiz, setQuiz] = useState(null);
    const [quizDemo, setQuizDemo] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [reviewsPage, setReviewsPage] = useState(0);
    const [maxReviews, setMaxReviews] = useState(0);
    const [countReviews, setCountReviews] = useState(0);
    const [hasMoreReviews, setHasMoreReviews] = useState(true);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const { quizId } = useParams();
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

    const handleLoadMoreReviews = () => {
        fetchReviews(reviewsPage + 1);
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
                            <h2 className="fw-bold">{quiz.title}</h2>
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
                            <Button className="btn-gradient w-100">
                                {quiz.price > 0 ? (
                                    <>
                                        <FaShoppingCart className="me-2" /> Mua Quiz
                                    </>
                                ) : (
                                    "Bắt đầu làm bài"
                                )}
                            </Button>
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
                            {quiz.highestScore && (
                                <>
                                    <h6 className="fw-bold mb-2">Điểm cao nhất:</h6>
                                    <h3 className="text-success fw-bold mb-3">{quiz.highestScore}%</h3>
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
