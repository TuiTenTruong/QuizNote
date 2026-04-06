import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    IQuestion,
    IReqCreateQuestion,
    IReqUpdateQuestion,
    IResCreateQuestion,
    IResUpdateQuestion,
    IResGetQuestions,
    IResDeleteQuestion,
} from "../types/question";

// Get questions by subject
export const getQuestionsBySubject = (subjectId: number): Promise<IResGetQuestions> => {
    return instance.get<never, IResGetQuestions>(`/api/v1/questions/subject/${subjectId}`);
};

// Get demo questions (limited)
export const getQuestionsDemo = (subjectId: number, page: number = 0, size: number = 5): Promise<IResGetQuestions> => {
    return instance.get<never, IResGetQuestions>(`/api/v1/questions/subject/${subjectId}?page=${page}&size=${size}`);
};

// Get random questions
export const getRandomQuestions = (subjectId: number, size: number): Promise<IApiResponse<IQuestion[]>> => {
    return instance.get<never, IApiResponse<IQuestion[]>>(`/api/v1/questions/subject/${subjectId}/random?size=${size}`);
};

// Create question
export const createQuestion = (data: IReqCreateQuestion): Promise<IResCreateQuestion> => {
    return instance.post<never, IResCreateQuestion>('/api/v1/questions', data);
};

// Create questions batch (with file)
export const createQuestionsBatch = (formData: FormData): Promise<IApiResponse<IQuestion[]>> => {
    return instance.post<never, IApiResponse<IQuestion[]>>('/api/v1/questions/batch', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Create questions batch (with data)
export const createQuestionsBatchData = (questions: IReqCreateQuestion[]): Promise<IApiResponse<IQuestion[]>> => {
    return instance.post<never, IApiResponse<IQuestion[]>>('/api/v1/questions/batch', questions);
};

// Update question
export const updateQuestion = (data: IReqUpdateQuestion): Promise<IResUpdateQuestion> => {
    return instance.put<never, IResUpdateQuestion>('/api/v1/questions', data);
};

// Delete question
export const deleteQuestion = (questionId: number): Promise<IResDeleteQuestion> => {
    return instance.delete<never, IResDeleteQuestion>(`/api/v1/questions/${questionId}`);
};
