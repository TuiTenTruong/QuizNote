import { useEffect, useState } from "react";
import { ISubject } from "../types";
import { subjectApi } from "../api";

export const fetchExploreCategories = async (): Promise<ISubject[]> => {
    const response = await subjectApi.getExploreData();
    if (response && response.statusCode === 200) {
        return response?.data?.result || [];
    }
    return [];
};

export const useHomeCategories = () => {
    const [quizCategories, setQuizCategories] = useState<ISubject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const categories = await fetchExploreCategories();
                setQuizCategories(categories);
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setIsLoading(false);
            }
        };

        void loadCategories();
    }, []);

    return { quizCategories, isLoading };
};

export const useHomeData = () => {
    return useHomeCategories();
};