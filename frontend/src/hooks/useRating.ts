import { useEffect, useState } from "react";
import { IComment } from "../types";
import { getUserRating } from "../api/comment.api";

interface UseMyRatingResult {
    myRating?: IComment;
    isLoading: boolean;
}

interface UseRatingResult extends UseMyRatingResult {
    rating: number;
    setRating: (value: number) => void;
    isRated: boolean;
    resetRating: () => void;
}

export const useMyRating = (
    userId: number | undefined,
    quizId: number,
    isAuthenticated: boolean
): UseMyRatingResult => {
    const [myRating, setMyRating] = useState<IComment>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchMyRatings = async () => {
            if (!isAuthenticated || !userId || !quizId) {
                setMyRating(undefined);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const response = await getUserRating(userId, quizId);
                setMyRating(response.data);
            } catch (error) {
                console.error("Error fetching my ratings:", error);
                setMyRating(undefined);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyRatings();
    }, [userId, quizId, isAuthenticated]);

    return { myRating, isLoading };
};

export const useRating = (
    userId: number | undefined,
    quizId: number,
    isAuthenticated: boolean,
    defaultRating: number = 5
): UseRatingResult => {
    const { myRating, isLoading } = useMyRating(userId, quizId, isAuthenticated);
    const [rating, setRating] = useState<number>(defaultRating);

    const resetRating = () => {
        setRating(defaultRating);
    };

    return {
        myRating,
        isLoading,
        rating,
        setRating,
        isRated: Boolean(myRating),
        resetRating,
    };
};

// Alias for typo-based import usage while keeping API explicit.
export const useReting = useRating;