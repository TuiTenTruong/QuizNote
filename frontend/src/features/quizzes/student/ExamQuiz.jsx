import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, ProgressBar, Modal } from "react-bootstrap";
import { FaClock, FaChevronLeft, FaChevronRight, FaFlagCheckered } from "react-icons/fa";
import "./ExamQuiz.scss";

const mockQuiz = {
    id: 1,
    title: "Phân loại động vật - Sinh học 7",
    duration: 20, // phút
    totalQuestions: 5,
    questions: [
        {
            id: 1,
            text: "Động vật nào sau đây thuộc lớp thú?",
            options: ["Cá heo", "Cá mập", "Ếch", "Rắn"],
            correct: 0,
        },
        {
            id: 2,
            text: "Động vật không có xương sống gọi là gì?",
            options: ["Động vật có dây sống", "Động vật nguyên sinh", "Động vật không xương sống", "Động vật thân mềm"],
            correct: 2,
        },
        {
            id: 3,
            text: "Lớp bò sát có đặc điểm gì?",
            options: ["Da trơn", "Da khô có vảy sừng", "Sống dưới nước", "Đẻ con"],
            correct: 1,
        },
        {
            id: 4,
            text: "Động vật máu nóng là gì?",
            options: [
                "Nhiệt độ cơ thể thay đổi theo môi trường",
                "Không có máu đỏ",
                "Nhiệt độ cơ thể ổn định",
                "Có máu lạnh",
            ],
            correct: 2,
        },
        {
            id: 5,
            text: "Loài nào sau đây không thuộc lớp chim?",
            options: ["Chim sẻ", "Gà", "Dơi", "Chim cánh cụt"],
            correct: 2,
        },
    ],
};

function ExamQuiz() {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState(Array(mockQuiz.totalQuestions).fill(null));
    const [timeLeft, setTimeLeft] = useState(mockQuiz.duration * 60);
    const [showSubmit, setShowSubmit] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (submitted) return;
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
    }, [timeLeft, submitted]);

    const handleSubmit = () => {
        const correctCount = mockQuiz.questions.reduce((acc, q, idx) => {
            return acc + (answers[idx] === q.correct ? 1 : 0);
        }, 0);
        setScore(Math.round((correctCount / mockQuiz.totalQuestions) * 100));
        setSubmitted(true);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const progress = Math.round(
        (answers.filter((a) => a !== null).length / mockQuiz.totalQuestions) * 100
    );

    if (submitted) {
        return (
            <div className="exam-result">
                <Container className="text-center py-5">
                    <h3 className="fw-bold text-gradient mb-3">
                        Kết quả bài thi: {mockQuiz.title}
                    </h3>
                    <h1 className={score >= 50 ? "text-success" : "text-danger"}>
                        {score} điểm
                    </h1>
                    <p className="text-secondary mb-4">
                        Bạn đã làm đúng {Math.round((score / 100) * mockQuiz.totalQuestions)} /
                        {mockQuiz.totalQuestions} câu.
                    </p>
                    <Button variant="outline-light" onClick={() => window.location.reload()}>
                        Làm lại
                    </Button>
                </Container>
            </div>
        );
    }

    return (
        <div className="exam-quiz">
            <Container fluid className="py-4">
                <Row>
                    <Col md={8}>
                        <Card className="bg-dark text-light border-0 p-4 shadow-sm">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="fw-bold">
                                    Câu {current + 1}/{mockQuiz.totalQuestions}
                                </h5>
                                <BadgeTime time={formatTime(timeLeft)} />
                            </div>
                            <h6 className="mb-4">{mockQuiz.questions[current].text}</h6>

                            {mockQuiz.questions[current].options.map((opt, i) => (
                                <Card
                                    key={i}
                                    className={`option-card p-3 mb-2 text-white ${answers[current] === i ? "selected" : ""
                                        }`}
                                    onClick={() => {
                                        const newAnswers = [...answers];
                                        newAnswers[current] = i;
                                        setAnswers(newAnswers);
                                    }}
                                >
                                    {opt}
                                </Card>
                            ))}

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
                                    disabled={current === mockQuiz.totalQuestions - 1}
                                    onClick={() => setCurrent(current + 1)}
                                >
                                    Sau <FaChevronRight />
                                </Button>
                            </div>
                        </Card>
                    </Col>

                    {/* Cột phải: Sidebar */}
                    <Col md={4} className="mt-4 mt-md-0">
                        <Card className="bg-dark text-light border-0 p-4 shadow-sm sticky-md-top">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold">Tiến độ làm bài</h6>
                                <span className="small text-secondary">{progress}%</span>
                            </div>
                            <ProgressBar
                                now={progress}
                                variant="gradient"
                                className="mb-3 progress-gradient"
                            />

                            <div className="grid-answers mb-4">
                                {mockQuiz.questions.map((_, i) => (
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
                                variant="danger"
                                className="w-100 mt-3"
                                onClick={() => setShowSubmit(true)}
                            >
                                <FaFlagCheckered className="me-2" /> Nộp bài
                            </Button>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Modal show={showSubmit} onHide={() => setShowSubmit(false)} centered>
                <Modal.Header closeButton className="bg-dark text-light border-secondary">
                    <Modal.Title>Xác nhận nộp bài</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-light">
                    Bạn có chắc muốn nộp bài không? Sau khi nộp sẽ không thể sửa.
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowSubmit(false)}>
                        Hủy
                    </Button>
                    <Button className="btn-gradient" onClick={handleSubmit}>
                        Nộp bài
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

// Component nhỏ hiển thị thời gian
function BadgeTime({ time }) {
    return (
        <div className="d-flex align-items-center gap-2 text-warning small">
            <FaClock /> {time}
        </div>
    );
}

export default ExamQuiz;
