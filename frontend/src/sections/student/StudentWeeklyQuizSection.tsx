import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    ProgressBar,
    Row,
    Spinner,
} from "react-bootstrap";
import { FaCheck, FaClock, FaCoins, FaLock, FaMedal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    IWeeklyQuizResult,
    useCurrentWeeklyQuizQuery,
    useWeeklyQuizSession,
    useWeeklyQuizStatusQuery,
    useWeeklyQuizSubmit,
    useWeeklyQuizTimer
} from "../../hooks/useWeeklyQuiz";
import styles from "./scss/StudentWeeklyQuizSection.module.scss";

export const StudentWeeklyQuizSection: React.FC = () => {
    const navigate = useNavigate();
    const { quiz, loading: quizLoading } = useCurrentWeeklyQuizQuery();
    const { status, setStatus, loading: statusLoading } = useWeeklyQuizStatusQuery(quiz?.id ?? 0);
    const [result, setResult] = useState<IWeeklyQuizResult | null>(null);

    const {
        inProgress,
        timeLeft,
        setTimeLeft,
        currentIndex,
        answers,
        message,
        setMessage,
        startQuiz: rawStartQuiz,
        handleSelectOption,
        goToPreviousQuestion,
        goToNextQuestion,
        startTime,
        setInProgress,
    } = useWeeklyQuizSession(quiz, Boolean(status?.hasPlayed));

    const { submitting, handleSubmit } = useWeeklyQuizSubmit(
        quiz,
        inProgress,
        startTime,
        answers,
        setStatus,
        setResult,
        setInProgress,
        setMessage
    );

    useWeeklyQuizTimer(inProgress, timeLeft, setTimeLeft, handleSubmit);

    useEffect(() => {
        if (status?.hasPlayed) {
            setResult({
                score: status.score ?? 0,
                percent: Math.round(status.accuracyPercent ?? 0),
                coins: status.coinsEarned ?? 0,
                streakBonus: 0,
            });
            return;
        }

        setResult(null);
    }, [status]);

    const startQuiz = useCallback(() => {
        setResult(null);
        rawStartQuiz();
    }, [rawStartQuiz]);

    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const currentQuestion = useMemo(() => {
        if (!quiz || !quiz.questions.length) {
            return null;
        }

        return quiz.questions[currentIndex] ?? null;
    }, [currentIndex, quiz]);

    const progressPercent = useMemo(() => {
        if (!quiz || quiz.questionCount === 0) {
            return 0;
        }
        return Math.round((answeredCount / quiz.questionCount) * 100);
    }, [answeredCount, quiz]);

    const loading = quizLoading || statusLoading;

    if (loading) {
        return (
            <div className={styles.weeklyQuizPage}>
                <Container className="py-5 text-center text-light">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tải Weekly Quiz...
                </Container>
            </div>
        );
    }

    if (!quiz || !status) {
        return (
            <div className={styles.weeklyQuizPage}>
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

    return (
        <div className={styles.weeklyQuizPage}>
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
                    <Col lg={8}>
                        <Card className="bg-dark text-light border-0 shadow-sm p-4 mb-3">
                            <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                                <div>
                                    <h5 className="fw-bold mb-1">{quiz.title}</h5>
                                    <div className="text-secondary small">
                                        {quiz.weekLabel} · {quiz.questionCount} câu · {" "}
                                        {quiz.durationMinutes} phút
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="mb-1">
                                        <Badge bg="warning" text="dark" className="me-2">
                                            <FaCoins className="me-1" />
                                            +{quiz.maxRewardCoins} xu
                                        </Badge>
                                        {quiz.difficulty && (
                                            <Badge bg="info" className="me-2">
                                                {quiz.difficulty}
                                            </Badge>
                                        )}
                                        {(status.currentStreak ?? 0) > 0 && (
                                            <Badge bg="success">
                                                Streak {status.currentStreak} tuần
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

                            <div className="d-flex flex-wrap gap-2 mb-4">
                                <div className={styles.pill}>
                                    <FaClock className="me-1" />
                                    {quiz.durationMinutes} phút giới hạn
                                </div>
                                <div className={styles.pill}>
                                    <FaMedal className="me-1" />
                                    Làm 1 lần duy nhất / tuần
                                </div>
                                <div className={styles.pill}>
                                    <FaCoins className="me-1" />
                                    Xu thưởng dựa trên điểm
                                </div>
                            </div>

                            {status.hasPlayed && !inProgress && result && (
                                <Card className={`${styles.resultCard} mb-4`}>
                                    <Card.Body className="d-flex flex-wrap justify-content-between align-items-center">
                                        <div>
                                            <div className="text-secondary small mb-1">Weekly result</div>
                                            <h4 className="fw-bold mb-1 text-success">
                                                {result.score}/{quiz.questionCount} câu đúng
                                            </h4>
                                            <div className="text-secondary small">
                                                Bạn nhận được:{" "}
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

                            {!inProgress && !status.hasPlayed && (
                                <div className="text-center py-4">
                                    <p className="text-secondary mb-3">
                                        Bạn chỉ có 1 lần duy nhất để làm Weekly này.
                                        Hãy sẵn sàng trước khi bắt đầu.
                                    </p>
                                    <Button className={`${styles.btnGradient} px-4`} onClick={startQuiz}>
                                        Bắt đầu Weekly Quiz
                                    </Button>
                                </div>
                            )}

                            {inProgress && currentQuestion && (
                                <>
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="fw-semibold">
                                            Câu {currentIndex + 1}/{quiz.questionCount}
                                        </div>
                                        <div className={styles.timerPill}>
                                            <FaClock className="me-1" />
                                            {formatTime(timeLeft)}
                                        </div>
                                    </div>

                                    <ProgressBar now={progressPercent} className={`${styles.progressThin} mb-3`} />

                                    <h6 className="mb-3">{currentQuestion.content}</h6>

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

                                    <div className="d-flex flex-column gap-2">
                                        {currentQuestion.options.map((opt, idx) => {
                                            const selected = answers[currentQuestion.id] === idx;
                                            return (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    className={`${styles.optionBtn} ${selected ? styles.optionBtnSelected : ""}`}
                                                    onClick={() => handleSelectOption(currentQuestion.id, idx)}
                                                >
                                                    <span className={`${styles.optionIndex} ${selected ? styles.optionIndexSelected : ""}`}>
                                                        {String.fromCharCode(65 + idx)}.
                                                    </span>
                                                    <span>{opt.content}</span>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        <Button
                                            variant="outline-light"
                                            disabled={currentIndex === 0}
                                            onClick={goToPreviousQuestion}
                                        >
                                            Trước
                                        </Button>
                                        <div className="text-secondary small">
                                            Đã trả lời {answeredCount}/{quiz.questionCount}
                                        </div>
                                        {currentIndex < quiz.questionCount - 1 ? (
                                            <Button variant="outline-light" onClick={goToNextQuestion}>
                                                Sau
                                            </Button>
                                        ) : (
                                            <Button
                                                className={styles.btnGradient}
                                                disabled={submitting}
                                                onClick={() => void handleSubmit()}
                                            >
                                                {submitting && (
                                                    <Spinner animation="border" size="sm" className="me-2" />
                                                )}
                                                Nộp bài
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}

                            {status.hasPlayed && !inProgress && !result && (
                                <div className={`${styles.lockedState} text-center py-4`}>
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

                    <Col lg={4}>
                        <Card className="bg-dark border-0 shadow-sm text-light p-3 mb-3">
                            <h6 className="fw-semibold mb-3">Weekly status</h6>
                            <div className="d-flex flex-column gap-2">
                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary small">Tuần hiện tại</span>
                                    <span className="fw-semibold">{quiz.weekLabel}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-secondary small">Trạng thái</span>
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
                                    <span className="text-secondary small">Streak Weekly</span>
                                    <span className="fw-semibold">{status.currentStreak ?? 0} tuần</span>
                                </div>
                                {status.hasPlayed && (
                                    <>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary small">Điểm tuần này</span>
                                            <span className="fw-semibold">
                                                {status.score ?? 0}/{quiz.questionCount}
                                            </span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="text-secondary small">Xu đã nhận</span>
                                            <span className="fw-semibold text-warning">
                                                +{status.coinsEarned ?? 0} xu
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card>

                        <Card className="bg-dark border-0 shadow-sm text-light p-3">
                            <h6 className="fw-semibold mb-2">Quy tắc Weekly Quiz</h6>
                            <ul className={`${styles.rulesList} mb-0`}>
                                <li>Làm tối đa 1 lần cho mỗi Weekly.</li>
                                <li>
                                    Điểm càng cao, xu nhận được càng nhiều (tối đa {quiz.maxRewardCoins} xu).
                                </li>
                                <li>
                                    Duy trì streak liên tiếp để nhận thêm xu bonus (mỗi tuần +10%, tối đa +50%).
                                </li>
                                <li>
                                    Thời gian giới hạn: {quiz.durationMinutes} phút, hết giờ sẽ tự động nộp bài.
                                </li>
                            </ul>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};