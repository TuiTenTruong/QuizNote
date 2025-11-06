import { useState } from "react";
import { Container, Row, Col, Button, Card, ProgressBar, Modal, Badge } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle, FaFlagCheckered, FaArrowLeft } from "react-icons/fa";
import "./QuizPracticePage.scss";
import { useEffect } from "react";
import { getQuizQuestions, startSubmission, submitQuizResult } from "../../../services/apiService";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const QuizPracticePage = () => {
    const [quizData, setQuizData] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [score, setScore] = useState(0);
    const [submissionId, setSubmissionId] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const QUESTIONS_PER_PAGE = 5;

    const quizId = location.state?.quizId || 0;
    const account = useSelector(state => state.user.account);

    // Session storage key
    const SESSION_KEY = `quiz_practice_${quizId}_${account?.id}`;

    // Save state to sessionStorage
    const saveToSession = (data) => {
        try {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Error saving to sessionStorage:", error);
        }
    };

    // Load state from sessionStorage
    const loadFromSession = () => {
        try {
            const saved = sessionStorage.getItem(SESSION_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Error loading from sessionStorage:", error);
            return null;
        }
    };

    // Clear sessionStorage
    const clearSession = () => {
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch (error) {
            console.error("Error clearing sessionStorage:", error);
        }
    };

    // Check if user is logged in
    useEffect(() => {
        if (!account || !account.id) {
            toast.error("Vui lòng đăng nhập để luyện tập.");
            navigate('/login', { state: { from: location.pathname } });
        }
    }, [account, navigate, location]);

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!account || !account.id) return;

            // Try to restore from session first
            const savedState = loadFromSession();

            try {
                let newSubmissionId;

                if (savedState && savedState.submissionId) {
                    // Resume existing submission
                    newSubmissionId = savedState.submissionId;
                    console.log("Resuming practice with submission ID:", newSubmissionId);
                } else {
                    // Start new submission
                    const startResponse = await startSubmission(quizId, account.id);
                    newSubmissionId = startResponse.data.id || startResponse.data.submissionId;
                    console.log("Practice submission started with ID:", newSubmissionId);
                }

                setSubmissionId(newSubmissionId);

                const response = await getQuizQuestions(quizId);

                const transformedData = {
                    ...response.data,
                    totalQuestions: response.data.length,
                    questions: response.data.map(question => ({
                        id: question.id,
                        text: question.content,
                        options: question.options
                            .sort((a, b) => a.optionOrder - b.optionOrder)
                            .map(opt => ({ id: opt.id, content: opt.content })),
                        correctOptionId: question.options.find(opt => opt.isCorrect)?.id,
                        explain: question.explanation,
                        chapterName: question.chapter ? question.chapter.name : null,
                    }))
                };

                setQuizData(transformedData);

                // Restore state or initialize new
                if (savedState) {
                    setAnswers(savedState.answers || new Array(transformedData.totalQuestions).fill(null));
                    setFeedback(savedState.feedback || new Array(transformedData.totalQuestions).fill(null));
                    setCurrentPage(savedState.currentPage || 0);
                } else {
                    setAnswers(new Array(transformedData.totalQuestions).fill(null));
                    setFeedback(new Array(transformedData.totalQuestions).fill(null));
                }
            } catch (error) {
                console.error("Error starting practice or fetching quiz:", error);
                alert("Có lỗi xảy ra khi bắt đầu luyện tập. Vui lòng thử lại.");
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
    }, [quizId, navigate, account]);

    // Save to session when state changes
    useEffect(() => {
        if (quizData && submissionId) {
            saveToSession({
                answers,
                feedback,
                currentPage,
                submissionId,
            });
        }
    }, [answers, feedback, currentPage, submissionId, quizData]);

    // Khi chọn đáp án
    const handleSelect = (questionIndex, optionId) => {
        if (answers[questionIndex] !== null) return; // tránh chọn lại
        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionId;
        setAnswers(newAnswers);

        const isCorrect = optionId === quizData.questions[questionIndex].correctOptionId;
        const newFeedback = [...feedback];
        newFeedback[questionIndex] = isCorrect;
        setFeedback(newFeedback);
    };

    const handleFinish = async () => {
        if (!submissionId) return;

        const correctCount = feedback.filter((f) => f === true).length;
        const calculatedScore = Math.round((correctCount / quizData.totalQuestions) * 100);

        // Prepare answers for backend - only send answered questions
        const formattedAnswers = quizData.questions
            .map((question, index) => {
                if (answers[index] !== null) {
                    return {
                        questionId: question.id,
                        selectedOptionId: answers[index]
                    };
                }
                return null;
            })
            .filter(answer => answer !== null);

        try {
            const response = await submitQuizResult(submissionId, formattedAnswers);
            console.log("Practice submission response:", response.data);

            const finalScore = response.data.score || response.data.percentage || calculatedScore;

            setScore(finalScore);
            setShowResult(true);

            // Clear session after finishing
            clearSession();
        } catch (error) {
            console.error("Error submitting practice result:", error);
            // Still show result even if submit fails
            setScore(calculatedScore);
            setShowResult(true);
            clearSession();
        }
    };

    const handleBack = () => {
        toast.info("Tiến độ luyện tập đã được lưu lại.");
        navigate(-1);
    };

    const handleQuestionNumberClick = (questionIndex) => {
        const newPage = Math.floor(questionIndex / QUESTIONS_PER_PAGE);
        setCurrentPage(newPage);
    };

    // Add loading check
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
                <p className="text-light">Đang tải bài tập...</p>
            </Container>
        );
    }

    // Move progress calculation here, after loading check
    const progress = Math.round(
        (answers.filter((a) => a !== null).length / quizData.totalQuestions) * 100
    );

    // Calculate current page
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

    if (showResult) {
        return (
            <div className="practice-result">
                <Container className="text-center py-5">
                    <h3 className="fw-bold text-gradient mb-3">
                        Kết thúc luyện tập
                    </h3>
                    <h1 className={score >= 50 ? "text-success" : "text-danger"}>
                        {score} điểm
                    </h1>
                    <p className="text-secondary">
                        Bạn đã trả lời đúng {feedback.filter((f) => f === true).length} /
                        {quizData.totalQuestions} câu.
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                        <Button variant="outline-light" onClick={() => {
                            clearSession();
                            window.location.reload();
                        }}>
                            Làm lại
                        </Button>
                        <Button variant="outline-primary" onClick={() => {
                            clearSession();
                            navigate(-1);
                        }}>
                            <FaArrowLeft className="me-2" /> Trở về
                        </Button>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="practice-quiz">
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
                                    {showChapterHeader && (
                                        <div className="chapter-divider mb-3 mt-4">
                                            <h5 className="text-light fw-bold">
                                                <Badge bg="primary">Chương {question.chapterName}</Badge>
                                            </h5>
                                            <hr className="text-secondary" />
                                        </div>
                                    )}
                                    <Card className="bg-dark text-light border-0 p-4 shadow-sm mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold">
                                                Câu {questionIndex + 1}/{quizData.totalQuestions}
                                            </h5>
                                            <Badge bg="secondary">Luyện tập</Badge>
                                        </div>

                                        <h6 className="mb-4">{question.text}</h6>

                                        {question.options.map((opt, i) => {
                                            const selected = answers[questionIndex] === opt.id;
                                            const isCorrect = question.correctOptionId === opt.id;
                                            const showFeedback = answers[questionIndex] !== null;

                                            return (
                                                <Card
                                                    key={opt.id}
                                                    className={`option-card p-3 mb-2 text-white ${selected ? "selected" : ""
                                                        } ${showFeedback && isCorrect ? "correct" : ""} ${showFeedback && selected && !isCorrect ? "wrong" : ""
                                                        }`}
                                                    onClick={() => handleSelect(questionIndex, opt.id)}
                                                >
                                                    {opt.content}
                                                </Card>
                                            );
                                        })}

                                        {/* Hiện phản hồi sau khi chọn */}
                                        {answers[questionIndex] !== null && (
                                            <div className="feedback mt-3 p-3 rounded">
                                                {feedback[questionIndex] ? (
                                                    <p className="text-success">
                                                        <FaCheckCircle className="me-2" />
                                                        Chính xác! {question.explain}
                                                    </p>
                                                ) : (
                                                    <p className="text-danger">
                                                        <FaTimesCircle className="me-2" />
                                                        Sai rồi! {question.explain}
                                                    </p>
                                                )}
                                            </div>
                                        )}
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
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h6 className="fw-semibold">Tiến độ luyện tập</h6>
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
