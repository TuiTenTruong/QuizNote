import { useEffect, useState } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    ProgressBar,
    Badge,
    Spinner,
    Alert,
} from "react-bootstrap";
import { FaClock, FaMedal, FaCoins, FaCheck, FaLock } from "react-icons/fa";
import "./WeeklyQuizPage.scss";
import { getCurrentWeeklyQuiz, getUserStatusInWeeklyQuiz, submitWeeklyQuiz } from "../../services/apiService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
function WeeklyQuizPage() {
    const [quiz, setQuiz] = useState(null);
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [inProgress, setInProgress] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0); // giây
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [startTime, setStartTime] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWeeklyQuiz();
    }, []);

    const fetchWeeklyQuiz = async () => {
        try {
            setLoading(true);
            // Lấy weekly quiz hiện tại
            const quizRes = await getCurrentWeeklyQuiz();
            console.log(quizRes);
            if (quizRes.statusCode == 200) {
                const quizData = quizRes.data;
                setQuiz(quizData);

                // Lấy trạng thái của user
                const statusRes = await getUserStatusInWeeklyQuiz(quizData.id);
                if (statusRes.statusCode === 200) {
                    setStatus(statusRes.data);

                    // Nếu đã làm rồi, set result
                    if (statusRes.data.hasPlayed) {
                        setResult({
                            score: statusRes.data.score,
                            percent: Math.round(statusRes.data.accuracyPercent),
                            coins: statusRes.data.coinsEarned,
                        });
                    }
                } else {
                    toast.error("Lỗi khi tải trạng thái Weekly Quiz");

                }
            } else if (quizRes.statusCode == 400) {
                toast.info("Hiện không có Weekly Quiz nào. Vui lòng quay lại sau!");
            } else {
                toast.error("Lỗi khi tải Weekly Quiz");

            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi tải Weekly Quiz");

        } finally {
            setLoading(false);
        }
    };

    // đếm ngược khi đang làm bài
    useEffect(() => {
        if (!inProgress || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // hết giờ tự nộp
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);

    }, [inProgress, timeLeft]);

    const startQuiz = () => {
        if (!quiz || status?.hasPlayed) return;
        setInProgress(true);
        setTimeLeft(quiz.durationMinutes * 60);
        setStartTime(Date.now());
        setCurrentIndex(0);
        setAnswers({});
        setResult(null);
        setMessage({ type: "", text: "" });
    };

    const handleSelectOption = (qId, optionIndex) => {
        if (!inProgress) return;
        setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    };

    const handleSubmit = async () => {
        if (!quiz || !inProgress) return;
        setSubmitting(true);

        try {
            // Tính thời gian làm bài
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);

            const formattedAnswers = {};
            quiz.questions.forEach((question) => {
                const selectedIndex = answers[question.id];
                if (selectedIndex !== undefined && question.options[selectedIndex]) {
                    formattedAnswers[question.id] = question.options[selectedIndex].id;
                }
            });

            const submitData = {
                weeklyQuizId: quiz.id,
                answers: formattedAnswers,
                timeTaken: timeTaken,
            };

            const response = await submitWeeklyQuiz(submitData);
            if (response.statusCode === 200) {
                const resultData = response.data;

                setResult({
                    score: resultData.score,
                    percent: Math.round(resultData.accuracyPercent),
                    coins: resultData.coinsEarned,
                    streakBonus: resultData.streakBonus || 0,
                });

                // Cập nhật status
                setStatus((prev) => ({
                    ...prev,
                    hasPlayed: true,
                    score: resultData.score,
                    coinsEarned: resultData.coinsEarned,
                    accuracyPercent: resultData.accuracyPercent,
                    currentStreak: resultData.currentStreak || prev.currentStreak,
                }));

                setInProgress(false);
                setMessage({
                    type: "success",
                    text: "Nộp bài thành công! Chúc mừng bạn đã hoàn thành Weekly Quiz.",
                });

                toast.success(`Bạn đã đạt ${resultData.score}/${quiz.questionCount} câu đúng và nhận được ${resultData.coinsEarned} xu!`);
            } else {
                toast.error(response.data?.message || "Có lỗi khi nộp bài, vui lòng thử lại.");
            }
        } catch (error) {
            setMessage({
                type: "danger",
                text: error.response?.data?.message || "Có lỗi khi nộp bài, vui lòng thử lại.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    if (loading) {
        return (
            <div className="weekly-quiz-page">
                <Container className="py-5 text-center text-light">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tải Weekly Quiz...
                </Container>
            </div>
        );
    }

    if (!quiz || !status) {
        return (
            <div className="weekly-quiz-page">
                <Container className="py-5 text-center text-light">
                    <div className="text-secondary mb-3">
                        <FaLock className="fs-1 mb-3" />
                    </div>
                    <h4 className="mb-3">Chưa có Weekly Quiz</h4>
                    <p className="text-muted">
                        Hiện tại chưa có Weekly Quiz nào được kích hoạt.
                        <br />
                        Vui lòng quay lại sau!
                    </p>
                    <Button variant="outline-light" onClick={() => navigate(-1)} className="mt-3">
                        Quay lại
                    </Button>
                </Container>
            </div>
        );
    }

    const currentQuestion = quiz.questions && quiz.questions[currentIndex];
    const answeredCount = Object.keys(answers).length;
    const progressPercent = Math.round(
        (answeredCount / quiz.questionCount) * 100
    );

    return (
        <>
            {quiz != null && <div className="weekly-quiz-page">
                <Container className="py-4">
                    {message.text && (
                        <Alert
                            variant={message.type}
                            onClose={() => setMessage({ type: "", text: "" })}
                            dismissible
                        >
                            {message.text}
                        </Alert>
                    )}

                    <Row className="g-4">
                        {/* Left: info + question */}
                        <Col lg={8}>
                            <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-3">
                                <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                                    <div>
                                        <h5 className="fw-bold mb-1">{quiz.title}</h5>
                                        <div className="text-secondary small">
                                            {quiz.weekLabel} · {quiz.questionCount} câu ·{" "}
                                            {quiz.durationMinutes} phút
                                        </div>
                                    </div>
                                    <div className="text-end">
                                        <div className="mb-1">
                                            <Badge bg="warning" text="dark" className="me-2">
                                                <FaCoins className="me-1" />
                                                +{quiz.maxRewardCoins} xu
                                            </Badge>
                                            <Badge bg="info" className="me-2">
                                                {quiz.difficulty}
                                            </Badge>
                                            {status.currentStreak > 0 && (
                                                <Badge bg="success">
                                                    🔥 Streak {status.currentStreak} tuần
                                                </Badge>
                                            )}
                                        </div>
                                        {status.hasPlayed && (
                                            <small className="text-secondary">
                                                Bạn đã làm Weekly này rồi, kết quả chỉ để tham khảo.
                                            </small>
                                        )}
                                    </div>
                                </div>

                                <p className="text-secondary mb-3">{quiz.description}</p>

                                {/* Summary chips giống LeetCode */}
                                <div className="d-flex flex-wrap gap-2 mb-4">
                                    <div className="pill">
                                        <FaClock className="me-1" />
                                        {quiz.durationMinutes} phút giới hạn
                                    </div>
                                    <div className="pill">
                                        <FaMedal className="me-1" />
                                        Làm 1 lần duy nhất / tuần
                                    </div>
                                    <div className="pill">
                                        <FaCoins className="me-1" />
                                        Xu thưởng dựa trên điểm
                                    </div>
                                </div>

                                {/* Nếu đã có kết quả */}
                                {status.hasPlayed && !inProgress && result && (
                                    <Card className="result-card mb-4">
                                        <Card.Body className="d-flex flex-wrap justify-content-between align-items-center">
                                            <div>
                                                <div className="text-secondary small mb-1">
                                                    Weekly result
                                                </div>
                                                <h4 className="fw-bold mb-1 text-success">
                                                    {result.score}/{quiz.questionCount} câu đúng
                                                </h4>
                                                <div className="text-secondary small">
                                                    Bạn nhận được: {" "}
                                                    <span className="text-warning fw-semibold">
                                                        {result.coins} xu
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-end">
                                                <div className="text-success fw-semibold mb-1">
                                                    {result.percent}% chính xác
                                                </div>
                                                {result.streakBonus > 0 && (
                                                    <div className="text-warning small">
                                                        Streak bonus: +{result.streakBonus} xu
                                                    </div>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                )}

                                {/* Khối làm bài */}
                                {!inProgress && !status.hasPlayed && (
                                    <div className="text-center py-4">
                                        <p className="text-secondary mb-3">
                                            Bạn chỉ có 1 lần duy nhất để làm Weekly này.
                                            Hãy sẵn sàng trước khi bắt đầu.
                                        </p>
                                        <Button
                                            className="btn-gradient px-4"
                                            onClick={startQuiz}
                                        >
                                            Bắt đầu Weekly Quiz
                                        </Button>
                                    </div>
                                )}

                                {inProgress && currentQuestion && (
                                    <>
                                        {/* Header question + timer */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div className="fw-semibold">
                                                Câu {currentIndex + 1}/{quiz.questionCount}
                                            </div>
                                            <div className="timer-pill">
                                                <FaClock className="me-1" />
                                                {formatTime(timeLeft)}
                                            </div>
                                        </div>

                                        {/* Progress */}
                                        <ProgressBar
                                            now={progressPercent}
                                            className="mb-3 progress-thin"
                                        />

                                        {/* Question text */}
                                        <h6 className="mb-3">{currentQuestion.content}</h6>

                                        {/* Question image if exists */}
                                        {currentQuestion.imageUrl && (
                                            <div className="mb-3">
                                                <img
                                                    src={currentQuestion.imageUrl}
                                                    alt="Question"
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: "300px" }}
                                                />
                                            </div>
                                        )}

                                        {/* Options */}
                                        <div className="d-flex flex-column gap-2">
                                            {currentQuestion.options.map((opt, idx) => {
                                                const selected =
                                                    answers[currentQuestion.id] === idx;
                                                return (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        className={`option-btn ${selected ? "selected" : ""
                                                            }`}
                                                        onClick={() =>
                                                            handleSelectOption(currentQuestion.id, idx)
                                                        }
                                                    >
                                                        <span className="option-index">
                                                            {String.fromCharCode(65 + idx)}.
                                                        </span>
                                                        <span>{opt.content}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Navigation */}
                                        <div className="d-flex justify-content-between align-items-center mt-4">
                                            <Button
                                                variant="outline-light"
                                                disabled={currentIndex === 0}
                                                onClick={() =>
                                                    setCurrentIndex((prev) => Math.max(prev - 1, 0))
                                                }
                                            >
                                                Trước
                                            </Button>
                                            <div className="text-secondary small">
                                                Đã trả lời {answeredCount}/{quiz.questionCount}
                                            </div>
                                            {currentIndex < quiz.questionCount - 1 ? (
                                                <Button
                                                    variant="outline-light"
                                                    onClick={() =>
                                                        setCurrentIndex((prev) =>
                                                            Math.min(prev + 1, quiz.questionCount - 1)
                                                        )
                                                    }
                                                >
                                                    Sau
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="btn-gradient"
                                                    disabled={submitting}
                                                    onClick={handleSubmit}
                                                >
                                                    {submitting && (
                                                        <Spinner
                                                            animation="border"
                                                            size="sm"
                                                            className="me-2"
                                                        />
                                                    )}
                                                    Nộp bài
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Nếu đã làm rồi mà chưa có result (trường hợp chỉ xem) */}
                                {status.hasPlayed && !inProgress && !result && (
                                    <div className="locked-state text-center py-4">
                                        <FaLock className="mb-2 fs-3 text-secondary" />
                                        <p className="text-secondary mb-1">
                                            Bạn đã hoàn thành Weekly tuần này.
                                        </p>
                                        <small className="text-muted">
                                            Hãy quay lại vào tuần sau để nhận Weekly mới.
                                        </small>
                                    </div>
                                )}
                            </Card>
                        </Col>

                        {/* Right: weekly meta + history */}
                        <Col lg={4}>
                            <Card className="bg-dark border-0 shadow-sm text-light p-3 mb-3">
                                <h6 className="fw-semibold mb-3">Weekly status</h6>
                                <div className="d-flex flex-column gap-2">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary small">
                                            Tuần hiện tại
                                        </span>
                                        <span className="fw-semibold">{quiz.weekLabel}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary small">
                                            Trạng thái
                                        </span>
                                        <span>
                                            {status.hasPlayed ? (
                                                <Badge bg="success">
                                                    <FaCheck className="me-1" />
                                                    Đã hoàn thành
                                                </Badge>
                                            ) : (
                                                <Badge bg="warning" text="dark">
                                                    Chưa làm
                                                </Badge>
                                            )}
                                        </span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-secondary small">
                                            Streak Weekly
                                        </span>
                                        <span className="fw-semibold">
                                            {status.currentStreak || 0} tuần
                                        </span>
                                    </div>
                                    {status.hasPlayed && (
                                        <>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-secondary small">
                                                    Điểm tuần này
                                                </span>
                                                <span className="fw-semibold">
                                                    {status.score}/{quiz.questionCount}
                                                </span>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="text-secondary small">
                                                    Xu đã nhận
                                                </span>
                                                <span className="fw-semibold text-warning">
                                                    +{status.coinsEarned} xu
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </Card>

                            <Card className="bg-dark border-0 shadow-sm text-light p-3">
                                <h6 className="fw-semibold mb-2">
                                    Quy tắc Weekly Quiz
                                </h6>
                                <ul className="rules-list mb-0">
                                    <li>Làm tối đa 1 lần cho mỗi Weekly.</li>
                                    <li>
                                        Điểm càng cao, xu nhận được càng nhiều (tối đa{" "}
                                        {quiz.maxRewardCoins} xu).
                                    </li>
                                    <li>
                                        Duy trì streak liên tiếp để nhận thêm xu bonus (mỗi tuần +10%, tối đa +50%).
                                    </li>
                                    <li>
                                        Thời gian giới hạn: {quiz.durationMinutes} phút, hết
                                        giờ sẽ tự động nộp bài.
                                    </li>
                                </ul>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>}

        </>

    );
}

export default WeeklyQuizPage;
