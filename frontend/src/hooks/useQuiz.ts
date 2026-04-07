import { useEffect, useState } from "react";
import { getUserPurchases } from "../api/order.api";
import { IResGetMyQuizzes, IResGetSubjects, ISubject, QuizItem } from "../types";
import { getAllActiveSubjects } from "../api/subject.api";

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

export const useAllSubjects = () => {
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
