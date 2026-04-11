import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaClock, FaBookOpen, FaTrophy, FaBrain } from "react-icons/fa";
import styles from "./scss/StudentQuizModeSelectSection.module.scss";
import { useEffect, useState } from "react";
import { getSubjectDetail } from "../../api/subject.api";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosCustomize";
import { ISubject } from "../../types";

interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}

interface ModeSelectLocationState {
    quiz?: ISubject;
}

type QuizMode = "practice" | "exam";

const StudentQuizModeSelectSection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState<ISubject | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [duration, setDuration] = useState<number>(10);
    const [numberOfQuestions, setNumberOfQuestions] = useState<number>(10);
    const account = useSelector((state: RootState) => state.user?.account);
    const parsedQuizId = Number(quizId ?? 0);

    const STORAGE_KEY = `exam_quiz_${parsedQuizId}_${account?.id ?? "guest"}`;
    const savedState = sessionStorage.getItem(STORAGE_KEY);
    const backendBaseURL = `${axiosInstance.defaults.baseURL ?? ""}storage/subjects/`;

    useEffect(() => {
        const stateQuiz = (location.state as ModeSelectLocationState | undefined)?.quiz;

        if (stateQuiz) {
            setQuiz(stateQuiz);
            setDuration(10);
            setNumberOfQuestions(Math.min(10, Math.max(1, stateQuiz.questionCount || 1)));
            setLoading(false);
        } else {
            // Fallback: gọi API nếu user truy cập trực tiếp URL
            const fetchQuizDetails = async () => {
                try {
                    if (!parsedQuizId) {
                        navigate("/");
                        return;
                    }

                    const response = await getSubjectDetail(parsedQuizId);
                    setQuiz(response.data);
                    setDuration(10);
                    setNumberOfQuestions(Math.min(10, Math.max(1, response.data.questionCount || 1)));
                } catch (error) {
                    console.error("Lỗi khi lấy chi tiết quiz:", error);
                    navigate("/");
                } finally {
                    setLoading(false);
                }
            };

            void fetchQuizDetails();
        }
    }, [location.state, navigate, parsedQuizId]);

    const handleSelectMode = (mode: QuizMode) => {
        if (!quiz) {
            return;
        }

        if (mode === "practice") {
            navigate(`/student/quizzes/${quiz.id}/practice`, { state: { quizId: quiz.id } });
        } else {
            navigate(`/student/quizzes/${quiz.id}/exam`, {
                state: {
                    quizId: quiz.id,
                    duration,
                    numberOfQuestions,
                }
            });
        }
    };

    if (loading) {
        return <div className="text-center text-light py-5">Đang tải...</div>;
    }

    if (!quiz) {
        return <div className="text-center text-light py-5">Không tìm thấy quiz.</div>;
    }

    return (
        <div className={styles.quizModePage}>
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col md={10} lg={8}>
                        {/* QUIZ HEADER */}
                        <Card className="bg-dark text-light border-0 shadow p-4 mb-4">
                            <Row className="g-3 align-items-center">
                                <Col xs={12} md={4}>
                                    <img
                                        src={backendBaseURL + quiz.imageUrl}
                                        alt={quiz.name}
                                        className="rounded-3 w-100"
                                        style={{ height: "180px", objectFit: "cover" }}
                                    />
                                </Col>
                                <Col xs={12} md={8}>
                                    <h4 className="fw-bold text-gradient mb-2">{quiz.name}</h4>
                                    <p className="text-secondary small mb-3">
                                        {quiz.createUser?.name ? quiz.createUser.name : quiz.name} • {quiz.questionCount} câu hỏi
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
                                        <li>Giới hạn {duration} phút</li>
                                        <li>Không hiển thị đáp án khi làm</li>
                                        <li>Kết quả được lưu và xếp hạng</li>
                                    </ul>
                                    {savedState == null && (<>
                                        <Form.Group controlId="formExamTime" className="mb-3">
                                            <Form.Label>Thời gian làm bài (phút)</Form.Label>
                                            <Form.Control className="bg-dark text-white"
                                                type="number"
                                                placeholder="Nhập thời gian"
                                                value={duration}
                                                onChange={(e) => {
                                                    const nextValue = Number(e.target.value);
                                                    setDuration(Number.isNaN(nextValue) ? 1 : Math.max(1, nextValue));
                                                }}
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
                                                value={numberOfQuestions}
                                                onChange={(e) => {
                                                    const nextValue = Number(e.target.value);
                                                    if (Number.isNaN(nextValue)) {
                                                        setNumberOfQuestions(1);
                                                        return;
                                                    }

                                                    const clampedValue = Math.min(
                                                        Math.max(1, nextValue),
                                                        Math.max(1, quiz.questionCount)
                                                    );
                                                    setNumberOfQuestions(clampedValue);
                                                }}
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

export default StudentQuizModeSelectSection;
