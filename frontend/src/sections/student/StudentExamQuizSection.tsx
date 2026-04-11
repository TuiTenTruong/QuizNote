import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Col, Container, Modal, ProgressBar, Row } from "react-bootstrap";
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaClock, FaFlag, FaFlagCheckered } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./scss/StudentExamQuizSection.module.scss";
import { getRandomQuestions } from "../../api/question.api";
import { startSubmission, submitQuiz } from "../../api/submission.api";
import { useBuildSubmissionAnswers, useIsDeadlineError } from "../../hooks/useSubmission";
import axiosInstance from "../../utils/axiosCustomize";
import type {
    AnswerValue,
    BadgeTimeProps,
    ImageModalState,
    QuestionViewModel,
    QuizDataViewModel,
    QuizLocationState,
    RootState,
    SavedExamState,
} from "../../types/examQuiz";

const QUESTIONS_PER_PAGE = 5;

function StudentExamQuizSection() {
    const [quizData, setQuizData] = useState<QuizDataViewModel | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [answers, setAnswers] = useState<AnswerValue[]>([]);
    const [flaggedQuestions, setFlaggedQuestions] = useState<boolean[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [showSubmit, setShowSubmit] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [submissionId, setSubmissionId] = useState<number | null>(null);
    const [correctCount, setCorrectCount] = useState<number>(0);
    const [tempMultipleChoiceAnswers, setTempMultipleChoiceAnswers] = useState<number[][]>([]);
    const [imageModal, setImageModal] = useState<ImageModalState>({ show: false, url: "" });

    const location = useLocation();
    const navigate = useNavigate();
    const locationState = (location.state as QuizLocationState | undefined) ?? {};

    const account = useSelector((state: RootState) => state.user?.account);
    const accountId = account?.id;

    const quizId = Number(locationState.quizId ?? 0);
    const duration = Number(locationState.duration ?? 10);
    const numberOfQuestions = Number(locationState.numberOfQuestions ?? 10);

    const backendBaseURL = `${axiosInstance.defaults.baseURL ?? ""}storage/questions/`;

    const questionRefs = useRef<Array<HTMLDivElement | null>>([]);
    const containerTopRef = useRef<HTMLDivElement | null>(null);
    const buildSubmissionAnswers = useBuildSubmissionAnswers();
    const isDeadlineError = useIsDeadlineError();

    const storageKey = `exam_quiz_${quizId}_${accountId ?? "guest"}`;

    useEffect(() => {
        if (!accountId) {
            toast.error("Vui lòng đăng nhập để làm bài thi.");
            navigate("/login", { state: { from: location.pathname } });
        }
    }, [accountId, location.pathname, navigate]);

    useEffect(() => {
        const savedState = sessionStorage.getItem(storageKey);
        if (!savedState) return;

        try {
            const parsed = JSON.parse(savedState) as SavedExamState;
            if (!parsed?.quizData?.questions || !parsed.submissionId) return;

            const now = Date.now();
            if (now >= parsed.endTime) {
                toast.warning("Thời gian làm bài đã hết. Hệ thống sẽ tự động nộp bài.");

                const formattedAnswers = buildSubmissionAnswers(parsed.quizData.questions, parsed.answers);
                void submitQuiz(parsed.submissionId, formattedAnswers)
                    .then((response) => {
                        const finalScore = Number(response.data.score ?? response.data.percentage ?? 0);
                        setScore(finalScore);
                        setCorrectCount(Number(response.data.correctCount ?? 0));
                        setSubmitted(true);
                        sessionStorage.removeItem(storageKey);
                        toast.info("Bài thi đã được tự động nộp do hết thời gian.");
                    })
                    .catch((error: unknown) => {
                        console.error("Error auto-submitting quiz:", error);
                        setScore(0);
                        setCorrectCount(0);
                        setSubmitted(true);
                        sessionStorage.removeItem(storageKey);
                        toast.error("Thời gian làm bài đã hết. Bài thi được tính 0 điểm.");
                        navigate(-1);
                    });

                return;
            }

            setQuizData(parsed.quizData);
            setAnswers(parsed.answers);
            setFlaggedQuestions(parsed.flaggedQuestions ?? []);
            setTempMultipleChoiceAnswers(parsed.tempMultipleChoiceAnswers ?? []);
            setStartTime(parsed.startTime);
            setEndTime(parsed.endTime);
            setSubmissionId(parsed.submissionId);
            setCurrentPage(parsed.currentPage ?? 0);
            setTimeLeft(Math.max(0, Math.floor((parsed.endTime - now) / 1000)));
        } catch (error: unknown) {
            console.error("Error loading saved state:", error);
        }
    }, [buildSubmissionAnswers, navigate, storageKey]);

    useEffect(() => {
        if (!quizData || !startTime || !endTime || !submissionId) return;

        const stateToSave: SavedExamState = {
            quizData,
            answers,
            flaggedQuestions,
            tempMultipleChoiceAnswers,
            startTime,
            endTime,
            submissionId,
            currentPage,
        };

        sessionStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }, [answers, currentPage, endTime, flaggedQuestions, quizData, startTime, storageKey, submissionId, tempMultipleChoiceAnswers]);

    useEffect(() => {
        if (!endTime || !submissionId || submitted) return;

        const checkAndAutoSubmit = async () => {
            if (Date.now() >= endTime && !submitted) {
                await handleSubmit();
            }
        };

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                void checkAndAutoSubmit();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [endTime, submissionId, submitted]);

    useEffect(() => {
        if (!quizData || submitted) return;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = "Bạn đang làm bài thi. Nếu rời khỏi trang, tiến trình sẽ được lưu nhưng thời gian vẫn tiếp tục chạy.";
            return event.returnValue;
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [quizData, submitted]);

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!accountId) return;

            if (sessionStorage.getItem(storageKey)) return;

            try {
                const startResponse = await startSubmission({
                    subjectId: quizId,
                    userId: accountId,
                    duration,
                    isPractice: false,
                });

                const newSubmissionId = Number(startResponse.data.id);
                setSubmissionId(newSubmissionId);

                let startTimestamp = Date.now();
                let endTimestamp = startTimestamp + duration * 60 * 1000;

                if (startResponse.data.startedAt) {
                    startTimestamp = new Date(startResponse.data.startedAt).getTime();
                }

                if (startResponse.data.endTime) {
                    endTimestamp = new Date(startResponse.data.endTime).getTime();
                }

                setStartTime(startTimestamp);
                setEndTime(endTimestamp);
                setTimeLeft(Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000)));

                const response = await getRandomQuestions(quizId, numberOfQuestions);
                const questions = response.data.map((question) => {
                    const sortedOptions = [...question.options].sort((a, b) => a.optionOrder - b.optionOrder);
                    const correctOptions = sortedOptions.filter((option) => option.isCorrect);

                    const mappedQuestion: QuestionViewModel = {
                        id: question.id,
                        text: question.content,
                        imageUrl: question.imageUrl,
                        type: question.type,
                        options: sortedOptions.map((option) => ({
                            id: option.id,
                            content: option.content,
                            isCorrect: option.isCorrect,
                        })),
                        correctOptionId: correctOptions[0]?.id,
                        correctCount: correctOptions.length,
                        chapterName: question.chapter?.name ?? null,
                    };

                    return mappedQuestion;
                });

                const transformedData: QuizDataViewModel = {
                    totalQuestions: questions.length,
                    questions,
                };

                setQuizData(transformedData);
                setAnswers(new Array<AnswerValue>(transformedData.totalQuestions).fill(null));
                setFlaggedQuestions(new Array<boolean>(transformedData.totalQuestions).fill(false));
                setTempMultipleChoiceAnswers(new Array<number[]>(transformedData.totalQuestions).fill([]));
            } catch (error: unknown) {
                console.error("Error starting submission or fetching quiz:", error);
                alert("Có lỗi xảy ra khi bắt đầu bài thi. Vui lòng thử lại.");
                navigate(-1);
            }
        };

        if (quizId > 0 && accountId) {
            void fetchQuizData();
        }
    }, [accountId, duration, navigate, numberOfQuestions, quizId, storageKey]);

    useEffect(() => {
        if (submitted || !quizData || !endTime || !submissionId) return;

        let hasAutoSubmitted = false;

        const updateTimer = () => {
            const remaining = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0 && !submitted && !hasAutoSubmitted) {
                hasAutoSubmitted = true;
                toast.warning("Hết giờ! Đang tự động nộp bài...");
                void handleSubmit();
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [answers, endTime, quizData, submissionId, submitted]);

    const handleSelect = (questionIndex: number, optionId: number) => {
        if (!quizData) return;

        const question = quizData.questions[questionIndex];
        if (!question) return;

        if (question.type === "MULTIPLE_CHOICE") {
            const currentSelections = Array.isArray(answers[questionIndex]) ? (answers[questionIndex] as number[]) : [];
            const newSelections = currentSelections.includes(optionId)
                ? currentSelections.filter((id) => id !== optionId)
                : [...currentSelections, optionId];

            const newAnswers = [...answers];
            newAnswers[questionIndex] = newSelections.length > 0 ? newSelections : null;
            setAnswers(newAnswers);
            return;
        }

        const newAnswers = [...answers];
        newAnswers[questionIndex] = optionId;
        setAnswers(newAnswers);
    };

    const handleToggleFlag = (questionIndex: number) => {
        const newFlags = [...flaggedQuestions];
        newFlags[questionIndex] = !newFlags[questionIndex];
        setFlaggedQuestions(newFlags);
    };

    const handleSubmit = async () => {
        if (!quizData || !submissionId) return;

        const formattedAnswers = buildSubmissionAnswers(quizData.questions, answers);

        try {
            const response = await submitQuiz(submissionId, formattedAnswers);
            const finalScore = Number(response.data.score ?? response.data.percentage ?? 0);

            setScore(finalScore);
            setCorrectCount(Number(response.data.correctCount ?? 0));
            setSubmitted(true);
            setShowSubmit(false);
            sessionStorage.removeItem(storageKey);

            if (startTime) {
                const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(timeSpentSeconds / 60);
                const seconds = timeSpentSeconds % 60;
                console.log(`Time spent: ${minutes}m ${seconds}s`);
            }

            toast.success("Nộp bài thành công!");
        } catch (error: unknown) {
            console.error("Error submitting quiz result:", error);

            if (isDeadlineError(error)) {
                toast.error("Hết thời gian làm bài. Bài thi được tính 0 điểm.");
                setScore(0);
                setCorrectCount(0);
                setSubmitted(true);
                setShowSubmit(false);
                sessionStorage.removeItem(storageKey);
                navigate(-1);
            } else {
                toast.error("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
            }
        }
    };

    const handleQuestionNumberClick = (questionIndex: number) => {
        setCurrentPage(Math.floor(questionIndex / QUESTIONS_PER_PAGE));

        setTimeout(() => {
            questionRefs.current[questionIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
            });
        }, 100);
    };

    const handleBack = () => navigate(-1);

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleImageClick = (imageUrl: string) => setImageModal({ show: true, url: imageUrl });
    const handleCloseImageModal = () => setImageModal({ show: false, url: "" });

    if (!accountId) {
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

    const progress = Math.round((answers.filter((answer) => answer !== null).length / quizData.totalQuestions) * 100);
    const startIndex = currentPage * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, quizData.totalQuestions);
    const totalPages = Math.ceil(quizData.totalQuestions / QUESTIONS_PER_PAGE);
    const currentQuestions = quizData.questions.slice(startIndex, endIndex);

    const handlePrevPage = () => {
        if (currentPage <= 0) return;

        setCurrentPage(currentPage - 1);
        setTimeout(() => {
            containerTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleNextPage = () => {
        if (currentPage >= totalPages - 1) return;

        setCurrentPage(currentPage + 1);
        setTimeout(() => {
            containerTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    if (submitted) {
        return (
            <div className={styles.examResult}>
                <Container className="text-center py-5">
                    <h3 className="fw-bold text-gradient mb-3">Kết quả bài thi</h3>
                    <h1 className={score >= 50 ? "text-success" : "text-danger"}>{score} điểm</h1>
                    <p className="text-secondary mb-4">
                        Bạn đã làm đúng {correctCount} / {quizData.totalQuestions} câu.
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
        <div className={styles.examQuiz}>
            <Container fluid className="py-4">
                <div className="mb-3" ref={containerTopRef}>
                    <Button variant="outline-light" onClick={handleBack}>
                        <FaArrowLeft className="me-2" /> Trở về
                    </Button>
                </div>
                <Row>
                    <Col md={8}>
                        {currentQuestions.map((question, index) => {
                            const questionIndex = startIndex + index;

                            return (
                                <div key={question.id} ref={(element: HTMLDivElement | null) => { questionRefs.current[questionIndex] = element; }}>
                                    <Card className="bg-dark text-light border-0 p-4 shadow-sm mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h5 className="fw-bold">Câu {questionIndex + 1}/{quizData.totalQuestions}</h5>
                                            <div className="d-flex gap-2 align-items-center justify-content-between">
                                                {question.type === "MULTIPLE_CHOICE" && <p className="m-0">Chọn nhiều đáp án</p>}
                                                <Button
                                                    variant="link"
                                                    className={`flag-btn ${flaggedQuestions[questionIndex] ? "flagged" : ""}`}
                                                    onClick={() => handleToggleFlag(questionIndex)}
                                                    title={flaggedQuestions[questionIndex] ? "Bỏ đánh dấu" : "Đánh dấu câu hỏi"}
                                                >
                                                    <FaFlag />
                                                </Button>
                                            </div>
                                        </div>

                                        <h6 className="mb-4">{question.text}</h6>

                                        {question.imageUrl && (
                                            <div className="mb-3">
                                                <img
                                                    src={backendBaseURL + question.imageUrl}
                                                    alt="Question"
                                                    className="img-fluid rounded"
                                                    style={{ maxWidth: "300px", maxHeight: "400px" }}
                                                    onClick={() => handleImageClick(backendBaseURL + question.imageUrl)}
                                                    title="Click để xem ảnh lớn hơn"
                                                />
                                            </div>
                                        )}

                                        {question.options.map((option) => {
                                            const selected = Array.isArray(answers[questionIndex])
                                                ? (answers[questionIndex] as number[]).includes(option.id)
                                                : answers[questionIndex] === option.id;

                                            return (
                                                <Card
                                                    key={option.id}
                                                    className={`option-card p-3 mb-2 text-white ${selected ? "selected" : ""}`}
                                                    onClick={() => handleSelect(questionIndex, option.id)}
                                                >
                                                    {option.content}
                                                </Card>
                                            );
                                        })}
                                    </Card>
                                </div>
                            );
                        })}

                        <div className="d-flex justify-content-between align-items-center mt-4">
                            <Button variant="outline-light" disabled={currentPage === 0} onClick={handlePrevPage}>
                                <FaChevronLeft /> Trang trước
                            </Button>
                            <span className="text-light">Trang {currentPage + 1}/{totalPages}</span>
                            <Button variant="outline-light" disabled={currentPage === totalPages - 1} onClick={handleNextPage}>
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
                            <ProgressBar now={progress} className="mb-3 progress-gradient" />

                            <div className="grid-answers mb-4">
                                {quizData.questions.map((_, index) => (
                                    <Button
                                        key={index}
                                        size="sm"
                                        className={`num-btn ${answers[index] !== null ? "answered" : ""} ${index >= startIndex && index < endIndex ? "active" : ""} ${flaggedQuestions[index] ? "flagged" : ""}`}
                                        onClick={() => handleQuestionNumberClick(index)}
                                        title={flaggedQuestions[index] ? `Câu ${index + 1} (Đã đánh dấu)` : `Câu ${index + 1}`}
                                    >
                                        {index + 1}
                                    </Button>
                                ))}
                            </div>

                            <Button variant="danger" className="w-100 mt-3" onClick={() => setShowSubmit(true)}>
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
                <Modal.Body className="bg-dark text-light">Bạn có chắc muốn nộp bài không? Sau khi nộp sẽ không thể sửa.</Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowSubmit(false)}>
                        Hủy
                    </Button>
                    <Button className="btn-gradient" onClick={() => void handleSubmit()}>
                        Nộp bài
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={imageModal.show} onHide={handleCloseImageModal} size="lg" centered>
                <Modal.Header closeButton className="bg-dark text-light border-secondary">
                    <Modal.Title>Hình ảnh câu hỏi</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-center p-0">
                    <img
                        src={imageModal.url}
                        alt="Question Enlarged"
                        className="img-fluid w-100"
                        style={{ maxHeight: "80vh", objectFit: "contain" }}
                    />
                </Modal.Body>
            </Modal>
        </div>
    );
}

function BadgeTime({ time }: BadgeTimeProps) {
    return (
        <div className="d-flex align-items-center gap-2 text-warning small justify-content-end mb-3">
            <FaClock /> {time}
        </div>
    );
}

export default StudentExamQuizSection;
