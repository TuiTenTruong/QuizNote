import { useState } from "react";
import { Container, Row, Col, Button, Card, ProgressBar, Modal, Badge } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle, FaFlagCheckered } from "react-icons/fa";
import "./QuizPracticePage.scss";

const quizData = {
    id: 2,
    title: "Động vật học cơ bản - Sinh học 7",
    totalQuestions: 5,
    questions: [
        {
            id: 1,
            text: "Loài nào sau đây là động vật có xương sống?",
            options: ["Bạch tuộc", "Cá chép", "Sứa", "Giun đất"],
            correct: 1,
            explain: "Cá chép là động vật có xương sống, thuộc lớp cá xương.",
        },
        {
            id: 2,
            text: "Lớp thú có đặc điểm nào sau đây?",
            options: [
                "Đẻ trứng, có lông vũ",
                "Đẻ con, nuôi con bằng sữa mẹ",
                "Sống dưới nước, có mang",
                "Da trơn, hô hấp bằng da",
            ],
            correct: 1,
            explain: "Đặc điểm của lớp thú là đẻ con và nuôi con bằng sữa mẹ.",
        },
        {
            id: 3,
            text: "Động vật máu lạnh có đặc điểm gì?",
            options: [
                "Nhiệt độ cơ thể ổn định",
                "Không có máu đỏ",
                "Nhiệt độ cơ thể thay đổi theo môi trường",
                "Không có tim",
            ],
            correct: 2,
            explain:
                "Động vật máu lạnh có nhiệt độ cơ thể thay đổi tùy môi trường xung quanh.",
        },
        {
            id: 4,
            text: "Lớp chim có đặc điểm gì nổi bật?",
            options: [
                "Cơ thể có lông vũ, di chuyển bằng cánh",
                "Sống trong nước, có mang",
                "Hô hấp bằng da",
                "Sống ký sinh",
            ],
            correct: 0,
            explain:
                "Chim có lông vũ, chi trước biến thành cánh giúp chúng bay được.",
        },
        {
            id: 5,
            text: "Động vật lưỡng cư gồm nhóm nào sau đây?",
            options: ["Ếch nhái, sa giông", "Rắn, cá sấu", "Cá, mực", "Cá mập, cá đuối"],
            correct: 0,
            explain: "Lưỡng cư gồm ếch nhái, sa giông - sống được cả trên cạn và dưới nước.",
        },
    ],
};

function QuizPracticePage() {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState(Array(quizData.totalQuestions).fill(null));
    const [feedback, setFeedback] = useState(Array(quizData.totalQuestions).fill(null));
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    // Khi chọn đáp án
    const handleSelect = (i) => {
        if (answers[current] !== null) return; // tránh chọn lại
        const newAnswers = [...answers];
        newAnswers[current] = i;
        setAnswers(newAnswers);

        const isCorrect = i === quizData.questions[current].correct;
        const newFeedback = [...feedback];
        newFeedback[current] = isCorrect;
        setFeedback(newFeedback);
    };

    const handleFinish = () => {
        const correctCount = feedback.filter((f) => f === true).length;
        setScore(Math.round((correctCount / quizData.totalQuestions) * 100));
        setShowResult(true);
    };

    const progress = Math.round(
        (answers.filter((a) => a !== null).length / quizData.totalQuestions) * 100
    );

    if (showResult) {
        return (
            <div className="practice-result">
                <Container className="text-center py-5">
                    <h3 className="fw-bold text-gradient mb-3">
                        Kết thúc luyện tập: {quizData.title}
                    </h3>
                    <h1 className={score >= 50 ? "text-success" : "text-danger"}>
                        {score} điểm
                    </h1>
                    <p className="text-secondary">
                        Bạn đã trả lời đúng {feedback.filter((f) => f === true).length} /
                        {quizData.totalQuestions} câu.
                    </p>
                    <Button variant="outline-light" onClick={() => window.location.reload()}>
                        Làm lại
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="practice-quiz">
            <Container fluid className="py-4">
                <Row>
                    <Col md={8}>
                        <Card className="bg-dark text-light border-0 p-4 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold">
                                    Câu {current + 1}/{quizData.totalQuestions}
                                </h5>
                                <Badge bg="secondary">Luyện tập</Badge>
                            </div>

                            <h6 className="mb-4">{quizData.questions[current].text}</h6>

                            {quizData.questions[current].options.map((opt, i) => {
                                const selected = answers[current] === i;
                                const isCorrect = quizData.questions[current].correct === i;
                                const showFeedback = answers[current] !== null;

                                return (
                                    <Card
                                        key={i}
                                        className={`option-card p-3 mb-2 text-white ${selected ? "selected" : ""
                                            } ${showFeedback && isCorrect ? "correct" : ""} ${showFeedback && selected && !isCorrect ? "wrong" : ""
                                            }`}
                                        onClick={() => handleSelect(i)}
                                    >
                                        {opt}
                                    </Card>
                                );
                            })}

                            {/* Hiện phản hồi sau khi chọn */}
                            {answers[current] !== null && (
                                <div className="feedback mt-3 p-3 rounded">
                                    {feedback[current] ? (
                                        <p className="text-success">
                                            <FaCheckCircle className="me-2" />
                                            Chính xác! {quizData.questions[current].explain}
                                        </p>
                                    ) : (
                                        <p className="text-danger">
                                            <FaTimesCircle className="me-2" />
                                            Sai rồi! {quizData.questions[current].explain}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="d-flex justify-content-between align-items-center mt-4">
                                <Button
                                    variant="outline-light"
                                    disabled={current === 0}
                                    onClick={() => setCurrent(current - 1)}
                                >
                                    <FaChevronLeft /> Trước
                                </Button>
                                <Button
                                    variant="outline-light"
                                    disabled={current === quizData.totalQuestions - 1}
                                    onClick={() => setCurrent(current + 1)}
                                >
                                    Sau <FaChevronRight />
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    <Col md={4} className="mt-4 mt-md-0">
                        <Card className="bg-dark text-light border-0 p-4 shadow-sm sticky-md-top">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold">Tiến độ luyện tập</h6>
                                <span className="small text-secondary">{progress}%</span>
                            </div>
                            <ProgressBar
                                now={progress}
                                variant="gradient"
                                className="mb-3 progress-gradient"
                            />

                            <div className="grid-answers mb-4">
                                {quizData.questions.map((_, i) => (
                                    <Button
                                        key={i}
                                        size="sm"
                                        className={`num-btn ${answers[i] !== null ? "answered" : ""
                                            } ${i === current ? "active" : ""}`}
                                        onClick={() => setCurrent(i)}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

                            <Button
                                className="btn-gradient w-100"
                                onClick={handleFinish}
                                disabled={answers.every((a) => a === null)}
                            >
                                <FaFlagCheckered className="me-2" /> Kết thúc luyện tập
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default QuizPracticePage;
