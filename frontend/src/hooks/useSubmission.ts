import { useCallback } from "react";
import type { AxiosError } from "axios";
import type { AnswerValue, QuestionViewModel } from "../types/examQuiz";
import type { IReqSubmitAnswerDTO } from "../types/submission";

export const useBuildSubmissionAnswers = () => {
    return useCallback((questions: QuestionViewModel[], answers: AnswerValue[]): IReqSubmitAnswerDTO[] => {
        return questions.map((question, index) => {
            const answer = answers[index];

            if (typeof answer === "number") {
                return {
                    questionId: question.id,
                    selectedOptionId: answer,
                };
            }

            if (Array.isArray(answer) && answer.length > 0) {
                return {
                    questionId: question.id,
                    selectedOptionIds: answer,
                };
            }

            return {
                questionId: question.id,
            };
        });
    }, []);
};

export const useIsDeadlineError = () => {
    return useCallback((error: unknown): boolean => {
        const axiosError = error as AxiosError<{ message?: string }>;
        const message = (axiosError?.response?.data?.message ?? "").toLowerCase();
        return message.includes("expired") || message.includes("deadline");
    }, []);
};
