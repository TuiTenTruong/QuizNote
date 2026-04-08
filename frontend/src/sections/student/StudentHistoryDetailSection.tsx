import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { FaArrowLeft, FaCheckCircle, FaRedoAlt, FaTimesCircle } from "react-icons/fa";
import { useHistoryDetail } from "../../hooks/useHistoryDetail";
import styles from "./StudentQuizHistoryDetail.module.scss";

interface IProps {
    isLoading: boolean;
    questionData: ReturnType<typeof useHistoryDetail>["questionData"];
}
export const StudentHistoryDetailSection: React.FC<IProps> = ({ isLoading, questionData }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <Container className="text-center py-5 text-light">
                Đang tải kết quả...
            </Container>
        );
    }

    if (!questionData) {
        return (
            <Container className="text-center py-5 text-light">
                Không tìm thấy dữ liệu làm bài.
            </Container>
        );
    }

    const {
        startedAt,
        score = 0,
        totalQuestions = questionData.questions.length,
        correctCount = 0,
        questions,
        currentSubject,
    } = questionData;

    return (
        <div className={`${styles.quizHistoryDetail} bg-black text-light min-vh-100 py-4`}>
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button variant="outline-light" onClick={() => navigate(-1)}>
                        <FaArrowLeft className="me-2" /> Trở về
                    </Button>
                    <div className="text-center">
                        <h5 className={`${styles.textGradient} fw-bold mb-1`}>{currentSubject?.name || "Chi tiết lịch sử"}</h5>
                        {currentSubject && <h2 className="text-white small mb-0">{currentSubject.name}</h2>}
                    </div>
                    <Button
                        className={styles.btnGradient}
                        onClick={() => navigate(`/student/quizzes/${questionData.currentSubject.id}/mode-select`)}
                    >
                        <FaRedoAlt className="me-2" /> Làm lại quiz này
                    </Button>
                </div>

                <Card className="bg-dark border-secondary p-4 mb-4 text-white">
                    <Row className="gy-2">
                        <Col md={4}>
                            <p className="mb-1 text-white">Ngày làm</p>
                            <p>{startedAt}</p>
                        </Col>
                        <Col md={4}>
                            <p className="mb-1 text-white">Số câu hỏi</p>
                            <p>{totalQuestions}</p>
                        </Col>
                        <Col md={4}>
                            <p className="mb-1 text-white">Kết quả</p>
                            <p>
                                <span className={score >= 5 ? "text-success" : "text-danger"}>
                                    {correctCount}/{totalQuestions} câu đúng ({score}đ)
                                </span>
                            </p>
                        </Col>
                    </Row>
                </Card>

                {questions.map((q, index) => (
                    <Card key={q.id} className="bg-dark text-light border-0 p-4 shadow-sm mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 className="fw-bold">Câu {index + 1}/{totalQuestions}</h6>
                            <Badge bg={q.isCorrect ? "success" : "danger"}>{q.isCorrect ? "Đúng" : "Sai"}</Badge>
                        </div>

                        <p className="mb-3">{q.content}</p>

                        {q.options.map((opt) => {
                            const isSelected = q.selectedOptionIds?.includes(opt.id) ?? q.selectedOptionId === opt.id;
                            const isCorrect = opt.isCorrect;

                            return (
                                <Card
                                    key={opt.id}
                                    className={`${styles.optionReview} p-3 mb-2 text-white ${isCorrect ? styles.correct : ""} ${isSelected && !isCorrect ? styles.wrong : ""}`}
                                >
                                    <div className="d-flex align-items-center">
                                        {isCorrect && <FaCheckCircle className="text-success me-2" />}
                                        {isSelected && !isCorrect && <FaTimesCircle className="text-danger me-2" />}
                                        <span>{opt.content}</span>
                                    </div>
                                </Card>
                            );
                        })}

                        {q.explanation && (
                            <div className={`${styles.feedback} mt-3 p-3 rounded`}>
                                <p className="text-info small">Giai thich: {q.explanation}</p>
                            </div>
                        )}
                    </Card>
                ))}
            </Container>
        </div>
    );
};