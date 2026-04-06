import instance from "./client";
import type { IApiResponse } from "../types/api";
import type {
    ISubmission,
    IReqStartSubmission,
    IReqSubmitQuiz,
    IResStartSubmission,
    IResSubmitQuiz,
    IResGetHistory,
} from "../types/submission";

// Start a submission
export const startSubmission = (data: IReqStartSubmission): Promise<IResStartSubmission> => {
    return instance.post<never, IResStartSubmission>('/api/v1/submissions/start', data);
};

// Submit quiz answers
export const submitQuiz = (submissionId: number, data: IReqSubmitQuiz): Promise<IResSubmitQuiz> => {
    return instance.post<never, IResSubmitQuiz>(`/api/v1/submissions/${submissionId}/submit`, data);
};

// Get user's submission history
export const getSubmissionHistory = (userId: number): Promise<IResGetHistory> => {
    return instance.get<never, IResGetHistory>(`/api/v1/submissions/history/user/${userId}`);
};
