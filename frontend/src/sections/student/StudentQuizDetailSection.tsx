import type { FormEvent, ReactElement } from "react";
import { Container, Row, Col, Button, Card, ProgressBar, Form, Alert } from "react-bootstrap";
import { FaUserGraduate, FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReviewItem from "../../features/quizzes/student/ReviewItem";
import { navigateToSelectMode } from "../../utils/quizNavigation";
import type { IComment, IQuestion, ISubject } from "../../types";
import axiosInstance from "../../utils/axiosCustomize";
import styles from "./scss/StudentQuizDetail.module.scss";

interface SubmitMessage {
    type: "success" | "danger";
    text: string;
}

interface IProps {
    quizData: ISubject | null;
    quizDemo: IQuestion[];
    reviews: IComment[];
    reviewsPage: number;
    maxReviews: number;
    countReviews: number;
    hasMoreReviews: boolean;
    reviewsLoading: boolean;
    submitLoading: boolean;
    hasPurchased: boolean;
    isAuthenticated: boolean;
    isRating: boolean;
    rating: number;
    reviewContent: string;
    submitMessage: SubmitMessage | null;
    onLoadMoreReviews: () => void;
    onSubmitReview: (e: FormEvent<HTMLFormElement>) => void;
    onRatingChange: (rating: number) => void;
    onReviewContentChange: (content: string) => void;
}

const StudentQuizDetailSection = ({
    quizData,
    quizDemo,
    reviews,
    reviewsPage,
    maxReviews,
    countReviews,
    hasMoreReviews,
    reviewsLoading,
    submitLoading,
    hasPurchased,
    isAuthenticated,
    isRating,
    rating,
    reviewContent,
    submitMessage,
    onLoadMoreReviews,
    onSubmitReview,
    onRatingChange,
    onReviewContentChange,
}: IProps): ReactElement => {
    const navigate = useNavigate();

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
                                    <Form onSubmit={onSubmitReview}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="text-light">Xếp hạng</Form.Label>
                                            <div className="d-flex gap-2 mb-2 align-items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        onClick={() => onRatingChange(star)}
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
                                                onChange={(e) => onReviewContentChange(e.target.value)}
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
                                        <ReviewItem review={review} />
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
                                        <Button variant="outline-secondary" size="sm" onClick={onLoadMoreReviews}>
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
                                    <h6 className="fw-bold mb-0 text-white">{quizData.createUser.username}</h6>
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
