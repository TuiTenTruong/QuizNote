import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    ISubject,
    IReqCreateSubject,
    IResCreateSubject,
    IResUpdateSubject,
    IResGetSubjects,
    IResDeleteSubject,
    ISubjectPagination,
} from "../types/subject";

// Get all subjects
export const getAllSubjects = (): Promise<IResGetSubjects> => {
    return instance.get<never, IResGetSubjects>('/api/v1/subjects');
};

// Get all active subjects
export const getAllActiveSubjects = (): Promise<IResGetSubjects> => {
    return instance.get<never, IResGetSubjects>(`/api/v1/subjects?filter=status='ACTIVE'`);
};

// Get explore/demo subjects
export const getExploreData = (): Promise<IApiResponse<ISubjectPagination>> => {
    return instance.get<never, IApiResponse<ISubjectPagination>>('/api/v1/subjects/demo');
};

// Get subject detail
export const getSubjectDetail = (subjectId: number): Promise<IApiResponse<ISubject>> => {
    return instance.get<never, IApiResponse<ISubject>>(`/api/v1/subjects/${subjectId}`);
};

// Get seller's subject detail
export const getSellerSubjectDetail = (subjectId: number): Promise<IApiResponse<ISubject>> => {
    return instance.get<never, IApiResponse<ISubject>>(`/api/v1/subjects/my/${subjectId}`);
};

// Get subjects by seller
export const getSubjectsBySellerId = (
    sellerId: number,
    spec: string = '',
    page: number = 0
): Promise<IResGetSubjects> => {
    return instance.get<never, IResGetSubjects>(`/api/v1/subjects/seller/${sellerId}?spec=${spec}&page=${page}`);
};

// Create subject
export const createSubject = (formData: FormData): Promise<IResCreateSubject> => {
    return instance.post<never, IResCreateSubject>('/api/v1/subjects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Save draft subject
export const saveDraftSubject = (data: IReqCreateSubject): Promise<IResCreateSubject> => {
    return instance.post<never, IResCreateSubject>('/api/v1/subjects/draft', data);
};

// Update subject
export const updateSubject = (formData: FormData): Promise<IResUpdateSubject> => {
    return instance.put<never, IResUpdateSubject>('/api/v1/subjects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Delete subject
export const deleteSubject = (subjectId: number): Promise<IResDeleteSubject> => {
    return instance.delete<never, IResDeleteSubject>(`/api/v1/subjects/${subjectId}`);
};

// Approve subject (admin)
export const approveSubject = (subjectId: number): Promise<IApiSuccessResponse> => {
    return instance.put<never, IApiSuccessResponse>(`/api/v1/subjects/${subjectId}/approve`);
};

// Reject subject (admin)
export const rejectSubject = (subjectId: number): Promise<IApiSuccessResponse> => {
    return instance.put<never, IApiSuccessResponse>(`/api/v1/subjects/${subjectId}/reject`);
};