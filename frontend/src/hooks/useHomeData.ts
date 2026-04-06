import { useEffect, useState } from "react";
import { ISubject } from "../types";
import { subjectApi } from "../api";

export const useHomeData = () => {
    const [quizCategories, setQuizCategories] = useState<ISubject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await subjectApi.getExploreData();
                if (response && response.statusCode === 200) {
                    setQuizCategories(response?.data?.result || []);
                }
                console.log(response);
            } catch (error) {
                console.error("Failed to fetch home data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);
    return { quizCategories, isLoading };
}