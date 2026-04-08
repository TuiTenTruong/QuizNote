import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    IComment,
    IReqCreateComment,
    IResCreateComment,
    IResGetComment,
    IResGetComments,
} from "../types/comment";

// Get comments by subject
export const getCommentsBySubject = (
    subjectId: number,
    page: number = 0,
    size: number = 10
): Promise<IResGetComments> => {
    return instance.get<never, IResGetComments>(`/api/v1/comments/subject/${subjectId}?page=${page}&size=${size}`);
};

// Get user's rating for a subject
export const getUserRating = (userId: number, subjectId: number): Promise<IResGetComment> => {
    return instance.get<never, IResGetComment>(`/api/v1/comments/user/${userId}/${subjectId}`);
};

// Create comment
export const createComment = (subjectId: number, data: IReqCreateComment): Promise<IResCreateComment> => {
    return instance.post<never, IResCreateComment>(`/api/v1/comments/${subjectId}`, data);
};

// Reply to comment
export const replyComment = (parentCommentId: number, content: string): Promise<IResCreateComment> => {
    return instance.post<never, IResCreateComment>(`/api/v1/comments/reply/${parentCommentId}`, { content });
};
