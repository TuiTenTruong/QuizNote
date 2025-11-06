import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaRedoAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./StudentQuizHistoryDetail.scss";
import { getQuizQuestions } from "../../services/apiService";

const StudentQuizHistoryDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const submissionHistory = location.state?.item;
    console.log("Submission History from state:", submissionHistory);
    const [questionData, setQuestionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await getQuizQuestions(submissionHistory.currentSubject.id);
                const data = response.data;

                // Sắp xếp questions theo thứ tự trong submissionHistory.answers
                const sortedQuestions = data
                    .map((question) => {
                        const answerData = submissionHistory.answers.find(
                            (ans) => ans.questionId === question.id
                        );
                        return {
                            ...question,
                            selectedOptionId: answerData?.selectedOptionId,
                            isCorrect: answerData?.isCorrect,
                        };
                    })
                    .sort((a, b) => {
                        const indexA = submissionHistory.answers.findIndex(
                            (ans) => ans.questionId === a.id
                        );
                        const indexB = submissionHistory.answers.findIndex(
                            (ans) => ans.questionId === b.id
                        );
                        return indexA - indexB;
                    });

                setQuestionData({
                    ...submissionHistory,
                    questions: sortedQuestions,
                });
            } catch (error) {
                console.error("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (submissionHistory) fetchHistory();
    }, [submissionHistory]);

    if (loading)
        return (
            <Container className="text-center py-5 text-light">
                Đang tải kết quả...
            </Container>
        );

    if (!questionData)
        return (
            <Container className="text-center py-5 text-light">
                Không tìm thấy dữ liệu làm bài.
            </Container>
        );

    const { quizTitle, startedAt, score, totalQuestions, correctCount, questions, currentSubject } =
        questionData;

    return (
        <div className="quiz-history-detail bg-black text-light min-vh-100 py-4">
            <Container>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <Button
                        variant="outline-light"
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft className="me-2" /> Trở về
                    </Button>
                    <div className="text-center">
                        <h5 className="text-gradient fw-bold mb-1">{quizTitle}</h5>
                        {currentSubject && (
                            <h2 className="text-white small mb-0">{currentSubject.name}</h2>
                        )}
                    </div>
                    <Button
                        variant="gradient"
                        onClick={() => navigate("/student/quizzes/" + questionData.currentSubject.id + "/mode-select")}
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
                                    {correctCount}/{totalQuestions} câu đúng ({score}%)
                                </span>
                            </p>
                        </Col>
                    </Row>
                </Card>

                {questions.map((q, index) => {

                    return (
                        <Card
                            key={q.id}
                            className="bg-dark text-light border-0 p-4 shadow-sm mb-4"
                        >
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-bold">
                                    Câu {index + 1}/{totalQuestions}
                                </h6>
                                <Badge
                                    bg={q.isCorrect ? "success" : "danger"}
                                >
                                    {q.isCorrect ? "Đúng" : "Sai"}
                                </Badge>
                            </div>

                            <p className="mb-3">{q.content}</p>

                            {q.options.map((opt) => {
                                const isSelected = opt.id === q.selectedOptionId;
                                const isCorrect = opt.isCorrect;

                                return (
                                    <Card
                                        key={opt.id}
                                        className={`option-review p-3 mb-2 text-white ${isCorrect ? "correct" : ""
                                            } ${isSelected && !isCorrect ? "wrong" : ""}`}
                                    >
                                        <div className="d-flex align-items-center">
                                            {isCorrect && (
                                                <FaCheckCircle className="text-success me-2" />
                                            )}
                                            {isSelected && !isCorrect && (
                                                <FaTimesCircle className="text-danger me-2" />
                                            )}
                                            <span>{opt.content}</span>
                                        </div>
                                    </Card>
                                );
                            })}

                            {q.explanation && (
                                <div className="feedback mt-3 p-3 rounded">
                                    <p className="text-info small">
                                        💡 Giải thích: {q.explanation}
                                    </p>
                                </div>
                            )}
                        </Card>
                    );
                })}
            </Container>
        </div>
    );
};

export default StudentQuizHistoryDetail;
