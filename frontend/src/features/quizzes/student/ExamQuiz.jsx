import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, ProgressBar, Modal, Badge } from "react-bootstrap";
import { FaClock, FaChevronLeft, FaChevronRight, FaFlagCheckered, FaArrowLeft } from "react-icons/fa";
import "./ExamQuiz.scss";
import { getQuizRandom, submitQuizResult, startSubmission } from "../../../services/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ExamQuiz() {
    const [quizData, setQuizData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showSubmit, setShowSubmit] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [submissionId, setSubmissionId] = useState(null);
    const [correctCount, setCorrectCount] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const QUESTIONS_PER_PAGE = 5;

    const quizId = location.state?.quizId || 0;
    const duration = location.state?.duration || 10;

    const numberOfQuestions = location.state?.numberOfQuestions || 10;
    const account = useSelector(state => state.user.account);

    const STORAGE_KEY = `exam_quiz_${quizId}_${account?.id}`;
    // Check if user is logged in
    useEffect(() => {
        if (!account || !account.id) {
            toast.error("Vui lòng đăng nhập để làm bài thi.");
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [account, navigate, location]);

    // Load saved state from sessionStorage
    useEffect(() => {
        const savedState = sessionStorage.getItem(STORAGE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                setQuizData(parsed.quizData);
                setAnswers(parsed.answers);
                setStartTime(parsed.startTime);
                setEndTime(parsed.endTime);
                setSubmissionId(parsed.submissionId);
                setCurrentPage(parsed.currentPage || 0);

                // Calculate remaining time based on endTime
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((parsed.endTime - now) / 1000));
                setTimeLeft(remaining);
            } catch (error) {
                console.error("Error loading saved state:", error);
            }
        }
    }, [STORAGE_KEY]);


    // Save state to sessionStorage whenever it changes
    useEffect(() => {
        if (quizData && startTime && endTime && submissionId) {
            const stateToSave = {
                quizData,
                answers,
                startTime,
                endTime,
                submissionId,
                currentPage
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        }
    }, [quizData, answers, startTime, endTime, submissionId, currentPage, STORAGE_KEY]);

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!account || !account.id) return;

            // Check if we already have saved state
            const savedState = sessionStorage.getItem(STORAGE_KEY);
            if (savedState) {
                return; // Don't fetch again if we have saved data
            }

            try {
                // Start submission first to get submissionId and timestamps
                const startResponse = await startSubmission(quizId, account.id, duration);
                const newSubmissionId = startResponse.data.id;
                setSubmissionId(newSubmissionId);
                console.log("Submission started with ID:", newSubmissionId);

                // Get start and end time from backend response
                let startTimestamp = Date.now();
                let endTimestamp = startTimestamp + (duration * 60 * 1000);

                // If backend returns timestamps, use them (convert from ISO string to timestamp)
                if (startResponse.data.startedAt) {
                    startTimestamp = new Date(startResponse.data.startedAt).getTime();
                }
                if (startResponse.data.endTime) {
                    endTimestamp = new Date(startResponse.data.endTime).getTime();
                }

                setStartTime(startTimestamp);
                setEndTime(endTimestamp);

                // Calculate initial time left based on endTime
                const now = Date.now();
                const initialTimeLeft = Math.max(0, Math.floor((endTimestamp - now) / 1000));
                setTimeLeft(initialTimeLeft);

                // Then fetch quiz questions
                const response = await getQuizRandom(quizId, numberOfQuestions);

                const transformedData = {
                    ...response.data,
                    totalQuestions: response.data.length,
                    questions: response.data.map(question => ({
                        id: question.id,
                        text: question.content,
                        options: question.options
                            .map(opt => { return { id: opt.id, content: opt.content }; }),
                        correct: question.options.findIndex(opt => opt.isCorrect),
                        chapterName: question.chapter ? question.chapter.name : null,
                    }))
                };

                setQuizData(transformedData);
                setAnswers(new Array(transformedData.totalQuestions).fill(null));
            } catch (error) {
                console.error("Error starting submission or fetching quiz:", error);
                alert("Có lỗi xảy ra khi bắt đầu bài thi. Vui lòng thử lại.");
                navigate(-1);
            }
        };

        if (quizId && account && account.id) {
            fetchQuizData();
        } else if (!account || !account.id) {
            console.error("User not logged in");
        } else {
            console.error("Invalid quiz ID:", quizId);
        }
    }, [quizId, duration, navigate, account, STORAGE_KEY, numberOfQuestions]);

    // Timer countdown based on endTime
    useEffect(() => {
        if (submitted || !quizData || !endTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                handleSubmit();
            }
        };

        // Update immediately
        updateTimer();

        // Then update every second
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [endTime, submitted, quizData]);

    const handleSelect = (questionIndex, optionId) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionId;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        if (!quizData || !submissionId) return;

        // Prepare answers for backend - only send answered questions
        const formattedAnswers = quizData.questions
            .map((question, index) => {
                if (answers[index] !== null) {
                    return {
                        questionId: question.id,
                        selectedOptionId: answers[index]
                    };
                }
                return {
                    questionId: question.id,
                    selectedOptionId: -1
                };
            })
            .filter(answer => answer !== null);

        try {
            const response = await submitQuizResult(submissionId, formattedAnswers);
            console.log("Submission response:", response.data);

            // Use score from backend
            const finalScore = response.data.score || response.data.percentage || 0;

            setScore(finalScore);
            setCorrectCount(response.data.correctCount);
            setSubmitted(true);
            setShowSubmit(false);

            // Clear saved state after submission
            sessionStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error("Error submitting quiz result:", error);
            alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleQuestionNumberClick = (questionIndex) => {
        const newPage = Math.floor(questionIndex / QUESTIONS_PER_PAGE);
        setCurrentPage(newPage);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    if (!account || !account.id) {
        return (
            <Container className="text-center py-5">
                <p className="text-light">Đang kiểm tra đăng nhập...</p>
            </Container>
        );
    }

    if (!quizData) {
        return (
            <Container className="text-center py-5">
                <p className="text-light">Đang tải bài thi...</p>
            </Container>
        );
    }

    const progress = Math.round(
        (answers.filter((a) => a !== null).length / quizData.totalQuestions) * 100
    );

    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, quizData.totalQuestions);
    const totalPages = Math.ceil(quizData.totalQuestions / QUESTIONS_PER_PAGE);
    const currentQuestions = quizData.questions.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    if (submitted) {
        return (
            <div className="exam-result">
                <Container className="text-center py-5">
                    <h3 className="fw-bold text-gradient mb-3">
                        Kết quả bài thi
                    </h3>
                    <h1 className={score >= 50 ? "text-success" : "text-danger"}>
                        {score} điểm
                    </h1>
                    <p className="text-secondary mb-4">
                        Bạn đã làm đúng {correctCount} /
                        {quizData.totalQuestions} câu.
                    </p>
                    <div className="d-flex gap-2 justify-content-center">

                        <Button variant="outline-primary" onClick={handleBack}>
                            <FaArrowLeft className="me-2" /> Trở về
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="exam-quiz">
            <Container fluid className="py-4">
                <div className="mb-3">
                    <Button variant="outline-light" onClick={handleBack}>
                        <FaArrowLeft className="me-2" /> Trở về
                    </Button>
                </div>
                <Row>
                    <Col md={8}>
                        {currentQuestions.map((question, index) => {
                            const questionIndex = startIndex + index;
                            const prevQuestion = index > 0 ? currentQuestions[index - 1] : null;
                            const showChapterHeader = question.chapterName &&
                                (!prevQuestion || prevQuestion.chapterName !== question.chapterName);

                            return (
                                <div key={question.id}>
                                    <Card className="bg-dark text-light border-0 p-4 shadow-sm mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold">
                                                Câu {questionIndex + 1}/{quizData.totalQuestions}
                                            </h5>

                                        </div>

                                        <h6 className="mb-4">{question.text}</h6>

                                        {question.options.map((opt, i) => {
                                            const selected = answers[questionIndex] === opt.id;

                                            return (
                                                <Card
                                                    key={opt.id}
                                                    className={`option-card p-3 mb-2 text-white ${selected ? "selected" : ""}`}
                                                    onClick={() => handleSelect(questionIndex, opt.id)}
                                                >
                                                    {opt.content}
                                                </Card>
                                            );
                                        })}
                                    </Card>
                                </div>
                            );
                        })}

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button
                                variant="outline-light"
                                disabled={currentPage === 0}
                                onClick={handlePrevPage}
                            >
                                <FaChevronLeft /> Trang trước
                            </Button>
                            <span className="text-light">
                                Trang {currentPage + 1}/{totalPages}
                            </span>
                            <Button
                                variant="outline-light"
                                disabled={currentPage === totalPages - 1}
                                onClick={handleNextPage}
                            >
                                Trang sau <FaChevronRight />
                            </Button>
                        </div>
                    </Col>

                    <Col md={4} className="mt-4 mt-md-0">
                        <Card className="bg-dark text-light border-0 p-4 shadow-sm sticky-md-top">
                            <BadgeTime time={formatTime(timeLeft)} />
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold">Tiến độ làm bài</h6>
                                <span className="small text-secondary">{progress}%</span>
                            </div>
                            <ProgressBar
                                now={progress}
                                className="mb-3 progress-gradient"
                            />

                            <div className="grid-answers mb-4">
                                {quizData.questions.map((_, i) => (
                                    <Button
                                        key={i}
                                        size="sm"
                                        className={`num-btn ${answers[i] !== null ? "answered" : ""
                                            } ${i >= startIndex && i < endIndex ? "active" : ""}`}
                                        onClick={() => handleQuestionNumberClick(i)}
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
        <div className="d-flex align-items-center gap-2 text-warning small justify-content-end mb-3">
            <FaClock /> {time}
        </div>
    );
}

export default ExamQuiz;
