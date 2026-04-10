import { useCallback, useEffect, useRef, useState } from "react";
import { createComment, getCommentsBySubject } from "../api/comment.api";
import type { IComment, IReqCreateComment } from "../types";

interface CommentMeta {
    pages?: number;
    total?: number;
    last?: boolean;
}

interface CommentPagePayload {
    result?: IComment[];
    meta?: CommentMeta;
}

interface UseCommentQueryResult {
    reviews: IComment[];
    reviewsPage: number;
    maxReviews: number;
    countReviews: number;
    hasMoreReviews: boolean;
    reviewsLoading: boolean;
    fetchReviews: (page: number) => Promise<void>;
    resetReviews: () => void;
}

interface UseCreateCommentResult {
    submitLoading: boolean;
    submitReview: (data: IReqCreateComment) => Promise<boolean>;
}

const readCommentPayload = (data: unknown): { result: IComment[]; meta: CommentMeta } => {
    if (Array.isArray(data)) {
        return { result: data as IComment[], meta: {} };
    }

    const payload = (data ?? {}) as CommentPagePayload;
    return {
        result: Array.isArray(payload.result) ? payload.result : [],
        meta: payload.meta ?? {},
    };
};

export const useCommentQuery = (quizId: number, pageSize: number = 5): UseCommentQueryResult => {
    const [reviews, setReviews] = useState<IComment[]>([]);
    const [reviewsPage, setReviewsPage] = useState<number>(0);
    const [maxReviews, setMaxReviews] = useState<number>(0);
    const [countReviews, setCountReviews] = useState<number>(0);
    const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
    const [reviewsLoading, setReviewsLoading] = useState<boolean>(false);
    const hasMoreReviewsRef = useRef<boolean>(true);

    const resetReviews = useCallback(() => {
        setReviews([]);
        setReviewsPage(0);
        setMaxReviews(0);
        setCountReviews(0);
        setHasMoreReviews(true);
        hasMoreReviewsRef.current = true;
    }, []);

    useEffect(() => {
        hasMoreReviewsRef.current = hasMoreReviews;
    }, [hasMoreReviews]);

    const fetchReviews = useCallback(
        async (page: number) => {
            if (!quizId || (page > 0 && !hasMoreReviewsRef.current)) return;

            setReviewsLoading(true);
            try {
                const response = await getCommentsBySubject(quizId, page, pageSize);
                if (response.statusCode !== 200) return;

                const { result, meta } = readCommentPayload(response.data);
                setReviews((prev) => (page === 0 ? result : [...prev, ...result]));
                setReviewsPage(page);

                const totalPages = meta.pages ?? 0;
                const isLast = typeof meta.last === "boolean" ? meta.last : totalPages > 0 ? page >= totalPages - 1 : result.length < pageSize;

                setHasMoreReviews(!isLast);
                setMaxReviews(totalPages);
                setCountReviews(meta.total ?? result.length);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setReviewsLoading(false);
            }
        },
        [quizId, pageSize]
    );

    useEffect(() => {
        if (!quizId) {
            resetReviews();
            return;
        }

        resetReviews();
        void fetchReviews(0);
    }, [quizId, fetchReviews, resetReviews]);

    return {
        reviews,
        reviewsPage,
        maxReviews,
        countReviews,
        hasMoreReviews,
        reviewsLoading,
        fetchReviews,
        resetReviews,
    };
};

export const useCreateComment = (quizId: number): UseCreateCommentResult => {
    const [submitLoading, setSubmitLoading] = useState<boolean>(false);

    const submitReview = useCallback(
        async (data: IReqCreateComment): Promise<boolean> => {
            if (!quizId) return false;

            setSubmitLoading(true);
            try {
                const response = await createComment(quizId, data);
                if (response.statusCode !== 201) {
                    return false;
                }

                return true;
            } catch (error) {
                console.error("Error submitting review:", error);
                return false;
            } finally {
                setSubmitLoading(false);
            }
        },
        [quizId]
    );

    return {
        submitLoading,
        submitReview,
    };
};
