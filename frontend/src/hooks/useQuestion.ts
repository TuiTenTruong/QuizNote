import { useCallback, useEffect, useState } from 'react';
import { createQuestionsBatchData, deleteQuestion, getQuestionsBySubject, updateQuestion } from '../api/question.api';
import type { IReqUpdateQuestion } from '../types/question';

export const useSellerQuestionsQuery = (subjectId?: number) => {
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellerQuestions = useCallback(async () => {
        if (!subjectId) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getQuestionsBySubject(subjectId);
            setQuestions(response.data || []);
        } catch (fetchError) {
            console.error('Error fetching seller questions:', fetchError);
            setError('Khong the tai danh sach cau hoi.');
        } finally {
            setLoading(false);
        }
    }, [subjectId]);

    useEffect(() => {
        fetchSellerQuestions();
    }, [fetchSellerQuestions]);

    return {
        questions,
        loading,
        error,
        refetch: fetchSellerQuestions,
        setQuestions,
    };
};

export const useSellerDeleteQuestionMutation = () => {
    const [loading, setLoading] = useState(false);

    const deleteSellerQuestion = useCallback(async (questionId: number) => {
        try {
            setLoading(true);
            return await deleteQuestion(questionId);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        deleteSellerQuestion,
        loading,
    };
};

export const useSellerCreateQuestionsBatchMutation = () => {
    const [loading, setLoading] = useState(false);

    const createSellerQuestionsBatch = useCallback(async (payload: any[]) => {
        try {
            setLoading(true);
            return await createQuestionsBatchData(payload as any);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        createSellerQuestionsBatch,
        loading,
    };
};

export const useSellerUpdateQuestionMutation = () => {
    const [loading, setLoading] = useState(false);

    const updateSellerQuestion = useCallback(async (payload: IReqUpdateQuestion) => {
        try {
            setLoading(true);
            return await updateQuestion(payload);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        updateSellerQuestion,
        loading,
    };
};
