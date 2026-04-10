import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent, Dispatch, FormEvent, SetStateAction } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosCustomize";
import {
    createWeeklyQuiz,
    deleteWeeklyQuiz,
    getAllWeeklyQuizzes,
    getCurrentWeeklyQuiz,
    getUserWeeklyQuizStatus,
    getWeeklyQuizQuestions,
    submitWeeklyQuiz,
    updateWeeklyQuiz,
} from "../api/weeklyQuiz.api";
import type {
    IResSubmitWeeklyQuiz,
    IWeeklyQuizQuestion,
    IWeeklyQuizSubmitData,
    IWeeklyQuizUserStatus
} from "../types";
import type {
    IAdminWeeklyQuizFormData,
    IAdminWeeklyQuizQuestionForm,
} from "../types/weeklyQuiz";


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

const buildEmptyQuestion = (): IAdminWeeklyQuizQuestionForm => ({
    content: "",
    imageFile: null,
    imagePreview: null,
    options: [
        { id: undefined, content: "", isCorrect: false },
        { id: undefined, content: "", isCorrect: false },
        { id: undefined, content: "", isCorrect: false },
        { id: undefined, content: "", isCorrect: false },
    ],
});

const buildDefaultQuestions = (): IAdminWeeklyQuizQuestionForm[] =>
    Array(10)
        .fill(null)
        .map(() => buildEmptyQuestion());

const getNextWeekInfo = () => {
    const now = new Date();
    const currentYear = now.getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    const currentWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
    const nextWeek = currentWeek + 1;

    if (nextWeek > 52) {
        return { year: currentYear + 1, weekNumber: 1 };
    }

    return { year: currentYear, weekNumber: nextWeek };
};

const getWeekStartDate = (year: number, weekNumber: number): string => {
    const jan4 = new Date(year, 0, 4);
    const jan4Day = jan4.getDay() || 7;
    const firstMonday = new Date(jan4);
    firstMonday.setDate(jan4.getDate() - jan4Day + 1);

    const targetMonday = new Date(firstMonday);
    targetMonday.setDate(firstMonday.getDate() + (weekNumber - 1) * 7);
    targetMonday.setHours(0, 0, 0, 0);

    return targetMonday.toISOString().slice(0, 16);
};

const getWeekEndDate = (year: number, weekNumber: number): string => {
    const monday = new Date(getWeekStartDate(year, weekNumber));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 0, 0);

    return sunday.toISOString().slice(0, 16);
};

const createInitialFormData = (): IAdminWeeklyQuizFormData => {
    const nextWeekInfo = getNextWeekInfo();
    return {
        title: "",
        description: "",
        year: nextWeekInfo.year,
        weekNumber: nextWeekInfo.weekNumber,
        difficulty: "Trung bình",
        startDate: getWeekStartDate(nextWeekInfo.year, nextWeekInfo.weekNumber),
        endDate: getWeekEndDate(nextWeekInfo.year, nextWeekInfo.weekNumber),
        questions: buildDefaultQuestions(),
    };
};

export const useAdminWeeklyQuiz = () => {
    const [weeklyQuizzes, setWeeklyQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [quizToDelete, setQuizToDelete] = useState<number | null>(null);
    const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
    const [formData, setFormData] = useState<IAdminWeeklyQuizFormData>(createInitialFormData());

    const backendBaseURL = `${axiosInstance.defaults.baseURL}storage/questions/`;

    const fetchWeeklyQuizzes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllWeeklyQuizzes();
            const rawData = response?.data as any;
            const list = Array.isArray(rawData?.result)
                ? rawData.result
                : Array.isArray(rawData)
                    ? rawData
                    : [];
            setWeeklyQuizzes(list);
        } catch (error) {
            console.error("Error fetching weekly quizzes:", error);
            toast.error("Loi khi tai danh sach weekly quiz");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchWeeklyQuizzes();
    }, [fetchWeeklyQuizzes]);

    const handleOpenModal = useCallback(async (quiz: any | null = null) => {
        if (quiz) {
            try {
                setLoading(true);
                const response = await getWeeklyQuizQuestions(quiz.id);
                const fetchedQuizData = response?.data as any;

                setEditMode(true);
                setCurrentQuiz(quiz);

                setFormData({
                    title: fetchedQuizData?.title || "",
                    description: fetchedQuizData?.description || "",
                    year: fetchedQuizData?.year || new Date().getFullYear(),
                    weekNumber: fetchedQuizData?.weekNumber || 1,
                    difficulty: fetchedQuizData?.difficulty || "Trung bình",
                    startDate: fetchedQuizData?.startDate
                        ? new Date(fetchedQuizData.startDate).toISOString().slice(0, 16)
                        : getWeekStartDate(fetchedQuizData?.year || new Date().getFullYear(), fetchedQuizData?.weekNumber || 1),
                    endDate: fetchedQuizData?.endDate
                        ? new Date(fetchedQuizData.endDate).toISOString().slice(0, 16)
                        : getWeekEndDate(fetchedQuizData?.year || new Date().getFullYear(), fetchedQuizData?.weekNumber || 1),
                    questions:
                        Array.isArray(fetchedQuizData?.questions) && fetchedQuizData.questions.length === 10
                            ? fetchedQuizData.questions.map((q: any) => ({
                                content: q.content || "",
                                imageFile: null,
                                imagePreview: q.imageUrl ? `${backendBaseURL}${q.imageUrl}` : null,
                                options: Array.isArray(q.options)
                                    ? q.options.map((opt: any) => ({
                                        id: opt.id,
                                        content: opt.content || "",
                                        isCorrect: Boolean(opt.isCorrect),
                                    }))
                                    : buildEmptyQuestion().options,
                            }))
                            : buildDefaultQuestions(),
                });

                setShowModal(true);
            } catch (error) {
                console.error("Error loading weekly quiz detail:", error);
                toast.error("Loi khi tai chi tiet weekly quiz");
            } finally {
                setLoading(false);
            }
            return;
        }

        setEditMode(false);
        setCurrentQuiz(null);
        setFormData(createInitialFormData());
        setShowModal(true);
    }, [backendBaseURL]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setEditMode(false);
        setCurrentQuiz(null);
    }, []);

    const handleQuestionChange = useCallback((index: number, field: "content" | "imagePreview", value: string) => {
        setFormData((prev) => {
            const nextQuestions = [...prev.questions];
            nextQuestions[index] = { ...nextQuestions[index], [field]: value };
            return { ...prev, questions: nextQuestions };
        });
    }, []);

    const handleQuestionFileChange = useCallback((qIndex: number, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFormData((prev) => {
            const nextQuestions = [...prev.questions];
            nextQuestions[qIndex] = {
                ...nextQuestions[qIndex],
                imageFile: file,
            };
            return { ...prev, questions: nextQuestions };
        });
    }, []);

    const handleOptionChange = useCallback((qIndex: number, optIndex: number, field: "content" | "isCorrect", value: string | boolean) => {
        setFormData((prev) => {
            const nextQuestions = [...prev.questions];
            const nextOptions = [...nextQuestions[qIndex].options];

            if (field === "isCorrect" && value) {
                nextOptions.forEach((opt, index) => {
                    nextOptions[index] = { ...opt, isCorrect: index === optIndex };
                });
            } else {
                nextOptions[optIndex] = {
                    ...nextOptions[optIndex],
                    [field]: value,
                };
            }

            nextQuestions[qIndex] = {
                ...nextQuestions[qIndex],
                options: nextOptions,
            };

            return { ...prev, questions: nextQuestions };
        });
    }, []);

    const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        for (let i = 0; i < formData.questions.length; i += 1) {
            const question = formData.questions[i];
            if (!question.content.trim()) {
                toast.error(`Cau hoi ${i + 1} khong duoc de trong`);
                return;
            }

            const validOptions = question.options.filter((opt) => opt.content.trim());
            if (validOptions.length < 2) {
                toast.error(`Cau hoi ${i + 1} phai co it nhat 2 dap an`);
                return;
            }

            const correctCount = question.options.filter((opt) => opt.isCorrect).length;
            if (correctCount !== 1) {
                toast.error(`Cau hoi ${i + 1} phai co dung 1 dap an dung`);
                return;
            }
        }

        try {
            const payload = new FormData();

            const weeklyQuizPayload = {
                title: formData.title,
                description: formData.description,
                year: formData.year,
                weekNumber: formData.weekNumber,
                difficulty: formData.difficulty,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                questions: formData.questions.map((question) => ({
                    content: question.content,
                    options: question.options
                        .filter((opt) => opt.content.trim())
                        .map((opt) => ({
                            id: opt.id,
                            content: opt.content,
                            isCorrect: opt.isCorrect,
                        })),
                })),
            };

            payload.append("weeklyQuiz", new Blob([JSON.stringify(weeklyQuizPayload)], { type: "application/json" }));

            formData.questions.forEach((question) => {
                if (question.imageFile) {
                    payload.append("images", question.imageFile);
                } else {
                    payload.append("images", new Blob());
                }
            });

            if (editMode && currentQuiz?.id) {
                const response = await updateWeeklyQuiz(currentQuiz.id, payload);
                if (response.statusCode === 200) {
                    toast.success("Cap nhat weekly quiz thanh cong");
                } else {
                    toast.error("Co loi xay ra khi cap nhat weekly quiz");
                    return;
                }
            } else {
                const response = await createWeeklyQuiz(payload);
                if (response.statusCode === 201) {
                    toast.success("Tao weekly quiz thanh cong");
                } else {
                    toast.error("Co loi xay ra khi tao weekly quiz");
                    return;
                }
            }

            handleCloseModal();
            await fetchWeeklyQuizzes();
        } catch (error: any) {
            console.error("Error saving weekly quiz:", error);
            toast.error(error?.response?.data?.message || "Co loi xay ra");
        }
    }, [currentQuiz?.id, editMode, fetchWeeklyQuizzes, formData, handleCloseModal]);

    const handleDeleteClick = useCallback((quizId: number) => {
        setQuizToDelete(quizId);
        setShowDeleteConfirm(true);
    }, []);

    const handleCloseDeleteConfirm = useCallback(() => {
        setShowDeleteConfirm(false);
        setQuizToDelete(null);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!quizToDelete) {
            return;
        }

        try {
            const response = await deleteWeeklyQuiz(quizToDelete);
            if (response.statusCode !== 200) {
                toast.error("Co loi xay ra khi xoa weekly quiz");
                return;
            }

            toast.success("Xoa weekly quiz thanh cong");
            await fetchWeeklyQuizzes();
        } catch (error: any) {
            console.error("Error deleting weekly quiz:", error);
            toast.error(error?.response?.data?.message || "Co loi xay ra");
        } finally {
            handleCloseDeleteConfirm();
        }
    }, [fetchWeeklyQuizzes, handleCloseDeleteConfirm, quizToDelete]);

    const formatRange = useCallback((start?: string, end?: string) => {
        if (!start || !end) {
            return "--";
        }

        const startLabel = new Date(start).toLocaleDateString("vi-VN");
        const endLabel = new Date(end).toLocaleDateString("vi-VN");
        return `${startLabel} - ${endLabel}`;
    }, []);

    return {
        weeklyQuizzes,
        loading,
        showModal,
        editMode,
        showDeleteConfirm,
        currentQuiz,
        formData,
        setFormData,
        handleOpenModal,
        handleCloseModal,
        handleQuestionChange,
        handleQuestionFileChange,
        handleOptionChange,
        handleSubmit,
        handleDeleteClick,
        handleCloseDeleteConfirm,
        handleConfirmDelete,
        formatRange,
    };
};
