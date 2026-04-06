import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    IWeeklyQuiz,
    IWeeklyQuizUserStatus,
    IWeeklyQuizSubmitData,
    IWeeklyQuizResult,
    IReqCreateWeeklyQuiz,
    IReqUpdateWeeklyQuiz,
    IResGetCurrentWeeklyQuiz,
    IResGetWeeklyQuizStatus,
    IResSubmitWeeklyQuiz,
    IResGetAllWeeklyQuizzes,
    IResCreateWeeklyQuiz,
    IResUpdateWeeklyQuiz,
    IResDeleteWeeklyQuiz,
} from "../types/weeklyQuiz";

// ============ USER ============

// Get current weekly quiz
export const getCurrentWeeklyQuiz = (): Promise<IResGetCurrentWeeklyQuiz> => {
    return instance.get<never, IResGetCurrentWeeklyQuiz>('/api/v1/weekly-quiz/current');
};

// Get user status in weekly quiz
export const getUserWeeklyQuizStatus = (quizId: number): Promise<IResGetWeeklyQuizStatus> => {
    return instance.get<never, IResGetWeeklyQuizStatus>(`/api/v1/weekly-quiz/${quizId}/status`);
};

// Submit weekly quiz
export const submitWeeklyQuiz = (data: IWeeklyQuizSubmitData): Promise<IResSubmitWeeklyQuiz> => {
    return instance.post<never, IResSubmitWeeklyQuiz>('/api/v1/weekly-quiz/submit', data);
};

// ============ ADMIN ============

// Get all weekly quizzes
export const getAllWeeklyQuizzes = (): Promise<IResGetAllWeeklyQuizzes> => {
    return instance.get<never, IResGetAllWeeklyQuizzes>('/api/v1/admin/weekly-quizzes');
};

// Get weekly quiz with questions (admin)
export const getWeeklyQuizQuestions = (quizId: number): Promise<IApiResponse<IWeeklyQuiz>> => {
    return instance.get<never, IApiResponse<IWeeklyQuiz>>(`/api/v1/admin/weekly-quizzes/${quizId}`);
};

// Create weekly quiz
export const createWeeklyQuiz = (formData: FormData): Promise<IResCreateWeeklyQuiz> => {
    return instance.post<never, IResCreateWeeklyQuiz>('/api/v1/admin/weekly-quizzes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Update weekly quiz
export const updateWeeklyQuiz = (quizId: number, formData: FormData): Promise<IResUpdateWeeklyQuiz> => {
    return instance.put<never, IResUpdateWeeklyQuiz>(`/api/v1/admin/weekly-quizzes/${quizId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Delete weekly quiz
export const deleteWeeklyQuiz = (quizId: number): Promise<IResDeleteWeeklyQuiz> => {
    return instance.delete<never, IResDeleteWeeklyQuiz>(`/api/v1/admin/weekly-quizzes/${quizId}`);
};
