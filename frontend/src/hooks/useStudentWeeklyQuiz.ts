import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getCurrentWeeklyQuiz, getUserWeeklyQuizStatus, submitWeeklyQuiz } from "../api/weeklyQuiz.api";
import { IResSubmitWeeklyQuiz, IWeeklyQuizSubmitAnswer, IWeeklyQuizSubmitData } from "../types";


type MessageType = "" | "success" | "danger";

interface IWeeklyQuizOption {
    id: number;
    content: string;
}

interface IWeeklyQuizQuestion {
    id: number;
    content: string;
    imageUrl?: string;
    options: IWeeklyQuizOption[];
}

interface IWeeklyQuizData {
    id: number;
    title: string;
    description?: string;
    weekLabel?: string;
    questionCount: number;
    durationMinutes: number;
    maxRewardCoins: number;
    difficulty?: string;
    questions: IWeeklyQuizQuestion[];
}

interface IWeeklyQuizStatus {
    hasPlayed: boolean;
    score?: number;
    accuracyPercent?: number;
    coinsEarned?: number;
    currentStreak?: number;
}

interface IWeeklyQuizResult {
    score: number;
    percent: number;
    coins: number;
    streakBonus: number;
}

interface IWeeklyQuizSubmitResponse {
    score: number;
    accuracyPercent: number;
    coinsEarned: number;
    streakBonus?: number;
    currentStreak?: number;
}

interface IApiResponse<T> {
    statusCode: number;
    data: T;
    message?: string;
}

interface IApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const normalizeQuizData = (rawQuiz: Partial<IWeeklyQuizData>): IWeeklyQuizData => {
    const questions = rawQuiz.questions ?? [];

    return {
        id: Number(rawQuiz.id ?? 0),
        title: rawQuiz.title ?? "Weekly Quiz",
        description: rawQuiz.description ?? "",
        weekLabel: rawQuiz.weekLabel,
        questionCount: Number(rawQuiz.questionCount ?? questions.length),
        durationMinutes: Number(rawQuiz.durationMinutes ?? 0),
        maxRewardCoins: Number(rawQuiz.maxRewardCoins ?? 0),
        difficulty: rawQuiz.difficulty,
        questions,
    };
};

export const useStudentWeeklyQuiz = () => {
    const [quiz, setQuiz] = useState<IWeeklyQuizData | null>(null);
    const [status, setStatus] = useState<IWeeklyQuizStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [inProgress, setInProgress] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState<IWeeklyQuizResult | null>(null);
    const [message, setMessage] = useState<{ type: MessageType; text: string }>({
        type: "",
        text: "",
    });
    const [startTime, setStartTime] = useState<number | null>(null);

    const fetchWeeklyQuiz = useCallback(async () => {
        try {
            setLoading(true);

            const quizRes = await getCurrentWeeklyQuiz() as IApiResponse<Partial<IWeeklyQuizData>>;

            if (quizRes.statusCode === 200) {
                const normalizedQuiz = normalizeQuizData(quizRes.data);
                setQuiz(normalizedQuiz);

                const statusRes = (await getUserWeeklyQuizStatus(normalizedQuiz.id)) as IApiResponse<IWeeklyQuizStatus>;
                if (statusRes.statusCode === 200) {
                    setStatus(statusRes.data);

                    if (statusRes.data.hasPlayed) {
                        setResult({
                            score: statusRes.data.score ?? 0,
                            percent: Math.round(statusRes.data.accuracyPercent ?? 0),
                            coins: statusRes.data.coinsEarned ?? 0,
                            streakBonus: 0,
                        });
                    }
                } else {
                    toast.error("Lỗi khi tải trạng thái Weekly Quiz");
                }
            } else if (quizRes.statusCode === 400) {
                toast.info("Hiện không có Weekly Quiz nào. Vui lòng quay lại sau!");
            } else {
                toast.error("Lỗi khi tải Weekly Quiz");
            }
        } catch (error) {
            const apiError = error as IApiError;
            toast.error(apiError.response?.data?.message || "Lỗi khi tải Weekly Quiz");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchWeeklyQuiz();
    }, [fetchWeeklyQuiz]);

    const handleSubmit = useCallback(async () => {
        if (!quiz || !inProgress || startTime === null || submitting) {
            return;
        }

        setSubmitting(true);

        try {
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);

            const formattedAnswers = {} as Record<number, number>;
            quiz.questions.forEach((question) => {
                const selectedIndex = answers[question.id];
                if (selectedIndex !== undefined && question.options[selectedIndex]) {
                    formattedAnswers[question.id] = question.options[selectedIndex].id;
                }
            });

            const submitData: IWeeklyQuizSubmitData = {
                weeklyQuizId: quiz.id,
                answers: formattedAnswers,
                timeTaken: timeTaken,
            };

            const response: IResSubmitWeeklyQuiz = (await submitWeeklyQuiz(submitData));

            if (response.statusCode === 200) {
                const resultData = response.data;

                setResult({
                    score: resultData.score,
                    percent: Math.round(resultData.percent),
                    coins: resultData.coins,
                    streakBonus: resultData.bonusSteak ?? 0,
                });

                setStatus((prev) => ({
                    hasPlayed: true,
                    score: resultData.score,
                    coinsEarned: resultData.coins,
                    accuracyPercent: resultData.percent,
                    currentStreak: resultData.currentStreak ?? prev?.currentStreak ?? 0,
                }));

                setInProgress(false);
                setMessage({
                    type: "success",
                    text: "Nộp bài thành công! Chúc mừng bạn đã hoàn thành Weekly Quiz.",
                });

                toast.success(
                    `Bạn đã đạt ${resultData.score}/${quiz.questionCount} câu đúng và nhận được ${resultData.coins} xu!`
                );
            } else {
                toast.error("Có lỗi khi nộp bài, vui lòng thử lại.");
            }
        } catch (error) {
            const apiError = error as IApiError;
            setMessage({
                type: "danger",
                text: apiError.response?.data?.message || "Có lỗi khi nộp bài, vui lòng thử lại.",
            });
        } finally {
            setSubmitting(false);
        }
    }, [answers, inProgress, quiz, startTime, submitting]);

    useEffect(() => {
        if (!inProgress || timeLeft <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setTimeLeft((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    void handleSubmit();
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [handleSubmit, inProgress, timeLeft]);

    const startQuiz = useCallback(() => {
        if (!quiz || status?.hasPlayed) {
            return;
        }

        setInProgress(true);
        setTimeLeft(quiz.durationMinutes * 60);
        setStartTime(Date.now());
        setCurrentIndex(0);
        setAnswers({});
        setResult(null);
        setMessage({ type: "", text: "" });
    }, [quiz, status?.hasPlayed]);

    const handleSelectOption = useCallback((questionId: number, optionIndex: number) => {
        if (!inProgress) {
            return;
        }
        setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    }, [inProgress]);

    const goToPreviousQuestion = useCallback(() => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const goToNextQuestion = useCallback(() => {
        if (!quiz) {
            return;
        }
        setCurrentIndex((prev) => Math.min(prev + 1, quiz.questionCount - 1));
    }, [quiz]);

    const formatTime = useCallback((seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    }, []);

    const currentQuestion = useMemo(() => {
        if (!quiz || !quiz.questions.length) {
            return null;
        }
        return quiz.questions[currentIndex] ?? null;
    }, [currentIndex, quiz]);

    const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

    const progressPercent = useMemo(() => {
        if (!quiz || quiz.questionCount === 0) {
            return 0;
        }
        return Math.round((answeredCount / quiz.questionCount) * 100);
    }, [answeredCount, quiz]);

    return {
        quiz,
        status,
        loading,
        inProgress,
        timeLeft,
        currentIndex,
        answers,
        submitting,
        result,
        message,
        currentQuestion,
        answeredCount,
        progressPercent,
        fetchWeeklyQuiz,
        startQuiz,
        handleSelectOption,
        handleSubmit,
        goToPreviousQuestion,
        goToNextQuestion,
        setMessage,
        formatTime,
    };
};
