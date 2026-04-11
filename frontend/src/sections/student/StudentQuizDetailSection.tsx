import { useEffect, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { Container, Row, Col, Button, Card, ProgressBar, Form, Alert } from "react-bootstrap";
import { FaUserGraduate, FaStar, FaShoppingCart } from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReviewItem from "./components/ReviewItem";
import { navigateToSelectMode } from "../../utils/quizNavigation";
import { useCommentQuery, useCreateComment } from "../../hooks/useComment";
import { useGetQuizDetail, useQuizDemo } from "../../hooks/useQuiz";
import { useReting } from "../../hooks/useRating";
import axiosInstance from "../../utils/axiosCustomize";
import styles from "./scss/StudentQuizDetail.module.scss";

interface SubmitMessage {
    type: "success" | "danger";
    text: string;
}

interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}

interface QuizDetailLocationState {
    hasPurchased?: boolean;
}

const REVIEW_PAGE_SIZE = 5;

const StudentQuizDetailSection = (): ReactElement => {
    const [reviewContent, setReviewContent] = useState<string>("");
    const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

    const { quizId } = useParams<{ quizId: string }>();
    const quizIdNumber = Number(quizId);
    const location = useLocation();
    const navigate = useNavigate();

    const account = useSelector((state: RootState) => state.user?.account);
    const isAuthenticated = Boolean(account?.id);
    const hasPurchased = Boolean((location.state as QuizDetailLocationState | undefined)?.hasPurchased);

    const { rating, setRating, isRated: isRating, resetRating } = useReting(account?.id, quizIdNumber, isAuthenticated);
    const { quizDetail: quizData } = useGetQuizDetail(quizIdNumber);
    const { quizDemo } = useQuizDemo(quizIdNumber, 0, 5);
    const {
        reviews,
        reviewsPage,
        maxReviews,
        countReviews,
        hasMoreReviews,
        reviewsLoading,
        fetchReviews,
        resetReviews,
    } = useCommentQuery(quizIdNumber, REVIEW_PAGE_SIZE);
    const { submitLoading, submitReview } = useCreateComment(quizIdNumber);

    useEffect(() => {
        if (!quizIdNumber || Number.isNaN(quizIdNumber)) {
            navigate("/");
        }
    }, [navigate, quizIdNumber]);

    const handleLoadMoreReviews = () => {
        fetchReviews(reviewsPage + 1);
    };

    const handleSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!quizIdNumber) return;

        if (isRating) {
            setSubmitMessage({ type: "danger", text: "Bạn đã đánh giá quiz này rồi." });
            return;
        }

        if (!reviewContent.trim()) {
            setSubmitMessage({ type: "danger", text: "Vui lòng nhập nội dung đánh giá!" });
            return;
        }

        setSubmitMessage(null);

        try {
            const isSuccess = await submitReview({
                content: reviewContent,
                rating,
                subjectName: quizData?.name ?? "",
            });

            if (isSuccess) {
                resetReviews();
                await fetchReviews(0);
                setSubmitMessage({ type: "success", text: "Đánh giá của bạn đã được gửi thành công!" });
                setReviewContent("");
                resetRating();
                return;
            }

            setSubmitMessage({ type: "danger", text: "Có lỗi xảy ra. Vui lòng thử lại!" });
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitMessage({ type: "danger", text: "Có lỗi xảy ra. Vui lòng thử lại!" });
        }
    };

    const backendBaseSubjectURL = `${axiosInstance.defaults.baseURL ?? ""}storage/subjects/`;
    const backendBaseUserURL = `${axiosInstance.defaults.baseURL ?? ""}storage/users/`;

    if (!quizData) {
        return <div className="text-center text-light p-5">Loading quiz details...</div>;
    }

    return (
        <div className={`${styles.studentQuizDetail} w-100`}>
            <div
                className={styles.quizBanner}
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9)), url(${backendBaseSubjectURL + quizData.imageUrl})`,
                }}
            >
                <Container className="py-5 text-white">
                    <Row>
                        <Col md={8}>
                            <h2 className="fw-bold">{quizData.name}</h2>
                            <p className={`text-light ${styles.textEllipsis}`}>{quizData.description}</p>
                            <div className="d-flex flex-wrap gap-3 mt-3 small text-white-50">
                                <span className="d-flex align-items-center">
                                    <FaUserGraduate className="me-1" /> {quizData.purchaseCount} học viên
                                </span>
                                <span className="text-warning d-flex align-items-center">
                                    <FaStar className="me-1" /> {(quizData.averageRating ?? 0).toFixed(1)} / 5
                                </span>
                            </div>
                        </Col>

                        <Col
                            md={4}
                            className="d-flex flex-column align-items-md-end justify-content-center mt-4 mt-md-0"
                        >
                            <h4 className={`${styles.textGradient} fw-bold mb-2`}>
                                {quizData.price > 0
                                    ? `${quizData.price.toLocaleString("vi-VN")} ₫`
                                    : "Miễn phí"}
                            </h4>

                            {!isAuthenticated ? (
                                <Button
                                    className={`${styles.btnGradient} w-100`}
                                    onClick={() => navigate("/login", { state: { from: `/student/quizzes/${quizData.id}` } })}
                                >
                                    Đăng nhập để tiếp tục
                                </Button>
                            ) : quizData.price === 0 || hasPurchased ? (
                                <Button className={`${styles.btnGradient} w-100`} onClick={() => navigateToSelectMode(navigate, quizData)}>
                                    Bắt đầu làm bài
                                </Button>
                            ) : (
                                <Button
                                    className={`${styles.btnGradient} w-100`}
                                    onClick={() => navigate(`/student/quiz-payment/${quizData.id}`, { state: { quiz: quizData } })}
                                >
                                    <FaShoppingCart className="me-2" /> Mua Quiz
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>

            <Container className="py-5">
                <Row className="gy-4">
                    <Col lg={8}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-4">
                            <h5 className="fw-bold mb-3">Tổng quan quiz</h5>
                            <p className="text-secondary mb-0">{quizData.description}</p>
                        </Card>

                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-4">
                            <h5 className="fw-bold mb-3">Câu hỏi mẫu</h5>
                            {quizDemo.length > 0 ? (
                                quizDemo.map((question, index) => (
                                    <div key={question.id} className={`${styles.sampleQuestion} mb-3`}>
                                        <strong>{index + 1}. </strong> {question.content}
                                        <ProgressBar
                                            now={question.correctnessPercentage}
                                            variant="purple"
                                            className="mt-2"
                                        />
                                    </div>
                                ))
                            ) : (
                                <p className="text-secondary">Không có câu hỏi mẫu nào.</p>
                            )}
                        </Card>

                        <Card className="bg-dark text-light border-0 shadow-sm p-4">
                            <h5 className="fw-bold mb-3">Đánh giá từ học viên {countReviews > 0 && `(${countReviews})`}</h5>

                            {isAuthenticated && !isRating && (quizData.price === 0 || hasPurchased) && (
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
                                                        style={{ cursor: "pointer", fontSize: "1.6rem" }}
                                                        className={star <= rating ? "text-warning" : "text-secondary"}
                                                    >
                                                        {star <= rating ? "★" : "☆"}
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
                                            className={styles.btnGradient}
                                            disabled={submitLoading}
                                        >
                                            {submitLoading ? "Đang gửi..." : "Gửi đánh giá"}
                                        </Button>
                                    </Form>
                                </Card>
                            )}

                            {isAuthenticated && isRating && (quizData.price === 0 || hasPurchased) && (
                                <Alert variant="success" className="mb-4">
                                    Bạn đã đánh giá quiz này rồi.
                                </Alert>
                            )}

                            {reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={review.id}>
                                        <ReviewItem
                                            review={review}
                                            replyingTo={null}
                                            onReplyClick={() => { }}
                                            onCancelReply={() => { }}
                                            onSubmitReply={() => { }}
                                            onReplyContentChange={() => { }}
                                        />
                                        {index < reviews.length - 1 && <hr className="text-secondary opacity-25" />}
                                    </div>
                                ))
                            ) : (
                                <p className="text-secondary">Chưa có đánh giá nào.</p>
                            )}

                            {reviewsLoading && <div className="text-center text-secondary">Đang tải...</div>}

                            {hasMoreReviews && !reviewsLoading && (
                                <div className="text-center mt-3">
                                    {reviewsPage < maxReviews - 1 ? (
                                        <Button variant="outline-secondary" size="sm" onClick={handleLoadMoreReviews}>
                                            Xem thêm đánh giá
                                        </Button>
                                    ) : (
                                        <span className="text-secondary">Đã tải hết đánh giá.</span>
                                    )}
                                </div>
                            )}
                        </Card>
                    </Col>

                    <Col lg={4}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 sticky-md-top">
                            <div className="d-flex align-items-center mb-3">
                                {quizData.createUser.avatarUrl && (
                                    <img
                                        src={backendBaseUserURL + quizData.createUser.avatarUrl}
                                        alt="author"
                                        className="rounded-circle me-3"
                                        width={60}
                                        height={60}
                                    />
                                )}

                                <div>
                                    <h6 className="fw-bold mb-0 text-white">{quizData.createUser.name}</h6>
                                    <small className="text-secondary">Teacher</small>
                                </div>
                            </div>
                            {quizData.highestScore !== null && quizData.highestScore !== undefined && (
                                <>
                                    <h6 className="fw-bold mb-2">Điểm cao nhất:</h6>
                                    <h3 className="text-success fw-bold mb-3">{quizData.highestScore}đ</h3>
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
        </div>
    );
};

export default StudentQuizDetailSection;
