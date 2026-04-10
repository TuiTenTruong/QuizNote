import { useEffect, useState } from "react";
import { getUserPurchases } from "../api/order.api";
import { IQuestion, IResGetMyQuizzes, IResGetSubjects, ISubject, QuizItem } from "../types";
import { getAllActiveSubjects, getSubjectDetail } from "../api/subject.api";
import { getQuestionsDemo } from "../api/question.api";

export const fetchMyQuizzesByUser = async (userId: number): Promise<QuizItem[]> => {
    const response: IResGetMyQuizzes = await getUserPurchases(userId);
    return response.statusCode === 200 ? response.data || [] : [];
};

export const fetchActiveSubjects = async (): Promise<ISubject[]> => {
    const response: IResGetSubjects = await getAllActiveSubjects();
    return response.statusCode === 200 ? response.data.result || [] : [];
};

export const fetchQuizDetailById = async (quizId: number): Promise<ISubject | null> => {
    const response = await getSubjectDetail(quizId);
    return response.data ?? null;
};

export const fetchQuizDemoQuestions = async (quizId: number, page: number, size: number): Promise<IQuestion[]> => {
    const response = await getQuestionsDemo(quizId, page, size);
    return response.statusCode === 200 ? response.data || [] : [];
};

export const useMyQuizzes = (userId?: number) => {
    const [myQuizzes, setMyQuizzes] = useState<QuizItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMyQuizzes = async () => {
            if (!userId) {
                setMyQuizzes([]);
                return;
            }

            setIsLoading(true);
            try {
                const quizzes = await fetchMyQuizzesByUser(userId);
                setMyQuizzes(quizzes);
            } catch (error) {
                console.error("Error fetching my quizzes:", error);
                setMyQuizzes([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchMyQuizzes();
    }, [userId]);

    return { myQuizzes, isLoading };
};

export const getMyQuizzes = useMyQuizzes;

export const useAllActiveSubjects = () => {
    const [subjects, setSubjects] = useState<ISubject[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchSubjects = async () => {
            setIsLoading(true);
            try {
                const subjectList = await fetchActiveSubjects();
                setSubjects(subjectList);
            } catch (error) {
                console.error("Error fetching subjects:", error);
                setSubjects([]);
            }
            finally {
                setIsLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    return { subjects, isLoading };
};

export const useGetQuizDetail = (quizId: number) => {
    const [quizDetail, setQuizDetail] = useState<ISubject | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchQuizDetail = async () => {
            if (!quizId || quizId <= 0) {
                setQuizDetail(null);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const detail = await fetchQuizDetailById(quizId);
                setQuizDetail(detail);
            } catch (error) {
                console.error("Error fetching quiz detail:", error);
                setQuizDetail(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizDetail();
    }, [quizId]);

    return { quizDetail, isLoading };
};

export const useQuizDemo = (quizId: number, page: number = 0, size: number = 5) => {
    const [quizDemo, setQuizDemo] = useState<IQuestion[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchQuizDemo = async () => {
            if (!quizId || quizId <= 0) {
                setQuizDemo([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const questions = await fetchQuizDemoQuestions(quizId, page, size);
                setQuizDemo(questions);
            } catch (error) {
                console.error("Error fetching quiz demo:", error);
                setQuizDemo([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchQuizDemo();
    }, [quizId, page, size]);

    return { quizDemo, isLoading };
};