import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";
import { getCurrentWeeklyQuiz, getUserWeeklyQuizStatus, submitWeeklyQuiz } from "../api/weeklyQuiz.api";
import type {
    IResSubmitWeeklyQuiz,
    IWeeklyQuizQuestion,
    IWeeklyQuizSubmitData,
    IWeeklyQuizUserStatus
} from "../types";


type MessageType = "" | "success" | "danger";

export interface IWeeklyQuizData {
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

export interface IWeeklyQuizStatus {
    hasPlayed: boolean;
    score?: number;
    accuracyPercent?: number;
    coinsEarned?: number;
    currentStreak?: number;
}

export interface IWeeklyQuizResult {
    score: number;
    percent: number;
    coins: number;
    streakBonus: number;
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

const toSubmitPayload = (
    quiz: IWeeklyQuizData,
    answers: Record<number, number>,
    startTime: number
): IWeeklyQuizSubmitData => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const formattedAnswers: Record<number, number> = {};

    quiz.questions.forEach((question) => {
        const selectedIndex = answers[question.id];
        if (selectedIndex !== undefined && question.options[selectedIndex]) {
            formattedAnswers[question.id] = question.options[selectedIndex].id;
        }
    });

    return {
        weeklyQuizId: quiz.id,
        answers: formattedAnswers,
        timeTaken,
    };
};

export const useCurrentWeeklyQuizQuery = () => {
    const [quiz, setQuiz] = useState<IWeeklyQuizData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWeeklyQuiz = useCallback(async () => {
        try {
            setLoading(true);

            const quizRes = await getCurrentWeeklyQuiz();

            if (quizRes.statusCode === 200) {
                const rawQuiz = quizRes.data as unknown as Partial<IWeeklyQuizData>;
                const normalizedQuiz = normalizeQuizData(rawQuiz);
                setQuiz(normalizedQuiz);
                return;
            }

            if (quizRes.statusCode === 400) {
                toast.info("Hiện không có Weekly Quiz nào. Vui lòng quay lại sau!");
                return;
            }

            toast.error("Lỗi khi tải Weekly Quiz");
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

    return {
        quiz,
        loading,
        fetchWeeklyQuiz,
    };
};

export const useWeeklyQuizStatusQuery = (quizId: number) => {
    const [status, setStatus] = useState<IWeeklyQuizStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchWeeklyQuizStatus = useCallback(async () => {
        if (!quizId) {
            setStatus(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const statusRes = await getUserWeeklyQuizStatus(quizId);
            if (statusRes.statusCode === 200) {
                const nextStatus = statusRes.data as IWeeklyQuizUserStatus;
                setStatus(nextStatus);
                return;
            }

            toast.error("Lỗi khi tải trạng thái Weekly Quiz");
        } catch (error) {
            const apiError = error as IApiError;
            toast.error(apiError.response?.data?.message || "Lỗi khi tải trạng thái Weekly Quiz");
        } finally {
            setLoading(false);
        }
    }, [quizId]);

    useEffect(() => {
        void fetchWeeklyQuizStatus();
    }, [fetchWeeklyQuizStatus]);

    return {
        status,
        setStatus,
        loading,
        fetchWeeklyQuizStatus,
    };
};

export const useWeeklyQuizSession = (quiz: IWeeklyQuizData | null, hasPlayed: boolean) => {
    const [inProgress, setInProgress] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [startTime, setStartTime] = useState<number | null>(null);
    const [message, setMessage] = useState<{ type: MessageType; text: string }>({
        type: "",
        text: "",
    });

    const startQuiz = useCallback(() => {
        if (!quiz || hasPlayed) {
            return;
        }

        setInProgress(true);
        setTimeLeft(quiz.durationMinutes * 60);
        setStartTime(Date.now());
        setCurrentIndex(0);
        setAnswers({});
        setMessage({ type: "", text: "" });
    }, [hasPlayed, quiz]);

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

    return {
        inProgress,
        setInProgress,
        timeLeft,
        setTimeLeft,
        currentIndex,
        answers,
        startTime,
        message,
        setMessage,
        startQuiz,
        handleSelectOption,
        goToPreviousQuestion,
        goToNextQuestion,
    };
};

export const useWeeklyQuizSubmit = (
    quiz: IWeeklyQuizData | null,
    inProgress: boolean,
    startTime: number | null,
    answers: Record<number, number>,
    setStatus: Dispatch<SetStateAction<IWeeklyQuizStatus | null>>,
    setResult: Dispatch<SetStateAction<IWeeklyQuizResult | null>>,
    setInProgress: Dispatch<SetStateAction<boolean>>,
    setMessage: Dispatch<SetStateAction<{ type: MessageType; text: string }>>
) => {
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        if (!quiz || !inProgress || startTime === null || submitting) {
            return;
        }

        setSubmitting(true);

        try {
            const submitData = toSubmitPayload(quiz, answers, startTime);
            const response: IResSubmitWeeklyQuiz = await submitWeeklyQuiz(submitData);

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
                return;
            }

            toast.error("Có lỗi khi nộp bài, vui lòng thử lại.");
        } catch (error) {
            const apiError = error as IApiError;
            setMessage({
                type: "danger",
                text: apiError.response?.data?.message || "Có lỗi khi nộp bài, vui lòng thử lại.",
            });
        } finally {
            setSubmitting(false);
        }
    }, [answers, inProgress, quiz, setInProgress, setMessage, setResult, setStatus, startTime, submitting]);

    return {
        submitting,
        handleSubmit,
    };
};

export const useWeeklyQuizTimer = (
    inProgress: boolean,
    timeLeft: number,
    setTimeLeft: Dispatch<SetStateAction<number>>,
    onTimeout: () => Promise<void>
) => {
    useEffect(() => {
        if (!inProgress || timeLeft <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setTimeLeft((prev) => {
                const next = prev - 1;
                if (next <= 0) {
                    void onTimeout();
                    return 0;
                }
                return next;
            });
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [inProgress, onTimeout, setTimeLeft, timeLeft]);
};
