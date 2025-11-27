import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaClock, FaBookOpen, FaTrophy, FaBrain } from "react-icons/fa";
import "./QuizModeSelect.scss";
import { useEffect, useState } from "react";
import { getQuizDetail } from "../../../services/apiService";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import axiosInstance from "../../../utils/axiosCustomize";
const QuizModeSelect = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState({});
    const [loading, setLoading] = useState(true);
    const account = useSelector(state => state.user.account);

    const STORAGE_KEY = `exam_quiz_${quizId}_${account?.id}`;
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";
    useEffect(() => {
        if (location.state?.quiz) {
            setQuiz(location.state.quiz);
            setLoading(false);
            console.log("Quiz data from state:", location.state.quiz);
        } else {
            // Fallback: gọi API nếu user truy cập trực tiếp URL
            const fetchQuizDetails = async () => {
                try {
                    const quizId = location.pathname.split("/")[3];
                    const response = await getQuizDetail(quizId);
                    setQuiz(response.data);
                    console.log("Quiz data from API:", response.data);
                } catch (error) {
                    console.error("Lỗi khi lấy chi tiết quiz:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchQuizDetails();
        }
    }, [quizId, location.state]);

    const handleSelectMode = (mode) => {
        if (mode === "practice") {
            navigate(`/student/quizzes/${quiz.id}/practice`, { state: { quizId: quiz.id } });
        } else {
            navigate(`/student/quizzes/${quiz.id}/exam`, { state: { quizId: quiz.id, duration: quiz.time, numberOfQuestions: quiz.numberOfQuestions } });
        }
    };

    if (loading) {
        return <div className="text-center text-light py-5">Đang tải...</div>;
    }

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
                                        src={backendBaseURL + quiz.imageUrl}
                                        alt={quiz.title}
                                        className="rounded-3 w-100"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col xs={12} md={8}>
                                    <h4 className="fw-bold text-gradient mb-2">{quiz.name}</h4>
                                    <p className="text-secondary small mb-3">
                                        {quiz.createUser?.username ? quiz.createUser.username : quiz.username} • {quiz.questionCount} câu hỏi
                                    </p>
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
                                    {savedState == null && (<>
                                        <Form.Group controlId="formExamTime" className="mb-3">
                                            <Form.Label>Thời gian làm bài (phút)</Form.Label>
                                            <Form.Control className="bg-dark text-white"
                                                type="number"
                                                placeholder="Nhập thời gian"
                                                value={quiz.time < 0 ? 1 : quiz.time}
                                                onChange={(e) => setQuiz({ ...quiz, time: e.target.value < 0 ? 1 : e.target.value })}
                                                min={1}
                                            />
                                        </Form.Group >
                                        <Form.Group controlId="formNumberOfQuestions" className="mb-3">
                                            <Form.Label>Số câu hỏi</Form.Label>
                                            <Form.Control className="bg-dark text-white"
                                                min={1}
                                                max={quiz.questionCount}
                                                type="number"
                                                placeholder="Nhập số câu hỏi"
                                                value={quiz.numberOfQuestions > quiz.questions ? quiz.questions : quiz.numberOfQuestions}
                                                onChange={(e) => setQuiz({ ...quiz, numberOfQuestions: e.target.value })}
                                            />
                                        </Form.Group>
                                    </>

                                    )
                                    }

                                    <Button
                                        variant="outline-light hover-gradient"
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
