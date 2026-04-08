import { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getQuestionsBySubject } from "../api/question.api";
import type { IQuestion, ISubmission } from "../types";

interface HistoryDetailLocationState {
    item?: ISubmission;
}

export interface IHistoryQuestion extends IQuestion {
    selectedOptionId?: number;
    selectedOptionIds?: number[];
    isCorrect?: boolean;
}

export interface IQuestionData extends ISubmission {
    questions: IHistoryQuestion[];
}

export const useHistoryDetail = () => {
    const location = useLocation();
    const { quizId } = useParams<{ quizId: string }>();
    const queryClient = useQueryClient();

    const submissionId = Number(quizId);
    const stateItem = (location.state as HistoryDetailLocationState | undefined)?.item;

    const { data: submissionHistory } = useQuery<ISubmission | null>({
        queryKey: ["submissionHistoryItem", submissionId],
        enabled: Number.isFinite(submissionId) && submissionId > 0,
        initialData: stateItem ?? null,
        queryFn: async () => {
            const cachedLists = queryClient.getQueriesData<ISubmission[]>({ queryKey: ["submissionHistory"] });
            const mergedItems = cachedLists.flatMap(([, list]) => list ?? []);
            return mergedItems.find((item) => item.id === submissionId) ?? null;
        },
        staleTime: 10 * 60 * 1000,
    });

    const subjectId = submissionHistory?.currentSubject?.id ?? 0;

    const { data: questionsResponse, isLoading } = useQuery({
        queryKey: ["subjectQuestions", subjectId],
        enabled: subjectId > 0,
        queryFn: () => getQuestionsBySubject(subjectId),
        staleTime: 10 * 60 * 1000,
    });

    const questionData = useMemo<IQuestionData | null>(() => {
        if (!submissionHistory || !questionsResponse?.data) return null;

        const answers = submissionHistory.answers ?? [];

        const sortedQuestions: IHistoryQuestion[] = questionsResponse.data
            .map((question) => {
                const answerData = answers.find((ans) => ans.questionId === question.id);

                return {
                    ...question,
                    selectedOptionId: answerData?.selectedOptionId,
                    selectedOptionIds: answerData?.selectedOptionIds,
                    isCorrect: answerData?.isCorrect,
                };
            })
            .sort((a, b) => {
                const indexA = answers.findIndex((ans) => ans.questionId === a.id);
                const indexB = answers.findIndex((ans) => ans.questionId === b.id);
                const safeIndexA = indexA === -1 ? Number.MAX_SAFE_INTEGER : indexA;
                const safeIndexB = indexB === -1 ? Number.MAX_SAFE_INTEGER : indexB;
                return safeIndexA - safeIndexB;
            });

        const filteredQuestions = sortedQuestions.filter((q) => q.isCorrect !== undefined);

        return {
            ...submissionHistory,
            questions: filteredQuestions,
        };
    }, [submissionHistory, questionsResponse?.data]);

    return {
        isLoading,
        questionData,
    };
};
