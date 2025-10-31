import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";
import { FaClock, FaBookOpen, FaTrophy, FaBrain, FaUser } from "react-icons/fa";
import "./QuizModeSelect.scss";

function QuizModeSelect() {
    const navigate = useNavigate();

    // 👉 Giả lập quiz đã được mua
    const quiz = {
        id: 5,
        title: "Phân loại động vật - Sinh học 7",
        thumbnail: "https://i.imgur.com/sbTQ0jR.jpg",
        author: "Nguyễn Văn A",
        questions: 50,
        time: "20 phút",
        topScore: 92,
        attempts: 3,
    };

    const handleSelectMode = (mode) => {
        if (mode === "practice") {
            navigate(`/quiz/${quiz.id}/practice`);
        } else {
            navigate(`/quiz/${quiz.id}/exam`);
        }
    };

    return (
        <div className="quiz-mode-page">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        {/* QUIZ HEADER */}
                        <Card className="bg-dark text-light border-0 shadow p-4 mb-4">
                            <Row className="g-3 align-items-center">
                                <Col xs={12} md={4}>
                                    <img
                                        src={quiz.thumbnail}
                                        alt={quiz.title}
                                        className="rounded-3 w-100"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col xs={12} md={8}>
                                    <h4 className="fw-bold text-gradient mb-2">{quiz.title}</h4>
                                    <p className="text-secondary small mb-3">
                                        {quiz.author} • {quiz.questions} câu hỏi • {quiz.time}
                                    </p>
                                    <div className="d-flex flex-wrap gap-3 text-white-50 small">
                                        <span>
                                            <FaUser className="me-1" /> Lần làm: {quiz.attempts}
                                        </span>
                                        <span>
                                            <FaTrophy className="me-1" /> Điểm cao nhất:{" "}
                                            <span className="text-success fw-semibold">
                                                {quiz.topScore}%
                                            </span>
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        </Card>

                        {/* MODE SELECTION */}
                        <Row className="g-4 mt-3">
                            {/* PRACTICE MODE */}
                            <Col md={6}>
                                <Card className="bg-dark text-light border-0 p-4 shadow-sm h-100 mode-card">
                                    <div className="icon-box bg-gradient mb-3">
                                        <FaBrain size={28} />
                                    </div>
                                    <h5 className="fw-bold mb-2">Chế độ Luyện tập</h5>
                                    <p className="text-secondary small mb-4">
                                        Làm bài không giới hạn thời gian, có thể xem đáp án sau mỗi
                                        câu hỏi. Phù hợp để ôn tập và học lại.
                                    </p>
                                    <ul className="small text-white-50 mb-4 ps-3">
                                        <li>Không giới hạn thời gian</li>
                                        <li>Xem đáp án sau mỗi câu</li>
                                        <li>Làm lại nhiều lần</li>
                                    </ul>
                                    <Button
                                        className="btn-gradient w-100"
                                        onClick={() => handleSelectMode("practice")}
                                    >
                                        <FaBrain className="me-2" /> Luyện tập ngay
                                    </Button>
                                </Card>
                            </Col>

                            {/* EXAM MODE */}
                            <Col md={6}>
                                <Card className="bg-dark text-light border-0 p-4 shadow-sm h-100 mode-card">
                                    <div className="icon-box bg-gradient mb-3">
                                        <FaTrophy size={28} />
                                    </div>
                                    <h5 className="fw-bold mb-2">Chế độ Thi</h5>
                                    <p className="text-secondary small mb-4">
                                        Làm bài có giới hạn thời gian, không hiển thị đáp án. Hệ
                                        thống chấm điểm và lưu kết quả tự động.
                                    </p>
                                    <ul className="small text-white-50 mb-4 ps-3">
                                        <li>Giới hạn {quiz.time}</li>
                                        <li>Không hiển thị đáp án khi làm</li>
                                        <li>Kết quả được lưu và xếp hạng</li>
                                    </ul>
                                    <Button
                                        variant="outline-light"
                                        className="w-100"
                                        onClick={() => handleSelectMode("exam")}
                                    >
                                        <FaClock className="me-2" /> Bắt đầu thi
                                    </Button>
                                </Card>
                            </Col>
                        </Row>

                        {/* FOOTNOTE */}
                        <div className="text-center mt-5 text-secondary small">
                            <FaBookOpen className="me-2" />
                            Hãy chọn chế độ phù hợp với mục tiêu của bạn.
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default QuizModeSelect;
