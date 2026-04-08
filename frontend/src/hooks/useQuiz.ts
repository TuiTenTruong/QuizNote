import { useEffect, useState } from "react";
import { getUserPurchases } from "../api/order.api";
import { IQuestion, IResGetMyQuizzes, IResGetSubjects, ISubject, QuizItem } from "../types";
import { getAllActiveSubjects, getSubjectDetail } from "../api/subject.api";
import { getQuestionsDemo } from "../api/question.api";

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
                const response: IResGetMyQuizzes = await getUserPurchases(userId);
                if (response.statusCode === 200) {
                    setMyQuizzes(response.data || []);
                } else {
                    setMyQuizzes([]);
                }
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
                const response: IResGetSubjects = await getAllActiveSubjects();
                if (response.statusCode === 200) {
                    setSubjects(response.data.result || []);
                } else {
                    setSubjects([]);
                }
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
                const response = await getSubjectDetail(quizId);
                setQuizDetail(response.data);
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
                const response = await getQuestionsDemo(quizId, page, size);
                console.log(response);
                if (response.statusCode === 200) {
                    setQuizDemo(response.data || []);
                } else {
                    setQuizDemo([]);
                }
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