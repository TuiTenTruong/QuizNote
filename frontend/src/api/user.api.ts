import instance from "./client";
import type { IApiResponse, IApiPaginatedResponse, IApiSuccessResponse } from "../types/api";
import type {
    IUser,
    IReqCreateUser,
    IReqUpdateUser,
    IResCreateUser,
    IResUpdateUser,
    IResGetUser,
    IResGetAdminUser,
    IResDeleteUser,
} from "../types/user";

// Get current logged-in user
export const getCurrentUser = (): Promise<IApiResponse<IUser>> => {
    return instance.get<never, IApiResponse<IUser>>('/api/v1/users/me');
};

// Get all users (paginated)
export const getAllUsers = (page: number = 0, size: number = 10): Promise<IResGetUser> => {
    return instance.get<never, IResGetUser>(`/api/v1/users?page=${page}&size=${size}`);
};

// Get all admin users (paginated)
export const getAllAdminUsers = (page: number = 0, size: number = 10): Promise<IResGetAdminUser> => {
    return instance.get<never, IResGetAdminUser>(`/api/v1/users?page=${page}&size=${size}`);
};

// Create user
export const createUser = (data: IReqCreateUser): Promise<IResCreateUser> => {
    return instance.post<never, IResCreateUser>('/api/v1/users', data);
};

// Update user
export const updateUser = (data: IReqUpdateUser): Promise<IResUpdateUser> => {
    return instance.put<never, IResUpdateUser>('/api/v1/users', data);
};

// Delete user
export const deleteUser = (userId: number): Promise<IResDeleteUser> => {
    return instance.delete<never, IResDeleteUser>(`/api/v1/users/${userId}`);
};

// Update user profile
export const updateUserProfile = (data: Partial<IUser>): Promise<IResUpdateUser> => {
    return instance.put<never, IResUpdateUser>('/api/v1/users/profile', data);
};

// Change password
export interface IReqChangePassword {
    currentPassword: string;
    newPassword: string;
}

export const changePassword = (data: IReqChangePassword): Promise<IApiSuccessResponse> => {
    return instance.post<never, IApiSuccessResponse>('/api/v1/users/change-password', data);
};

// Update user preferences
export const updateUserPreferences = (preferences: Record<string, unknown>): Promise<IApiSuccessResponse> => {
    return instance.put<never, IApiSuccessResponse>('/api/v1/users/preferences', preferences);
};

// Upload avatar
export const uploadAvatar = (email: string, file: File): Promise<IApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    return instance.post<never, IApiResponse<{ avatarUrl: string }>>(`/api/v1/users/${email}/avatar`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Change user status (active/inactive)
export interface IReqChangeStatus {
    id: number;
    status: boolean;
}

export const changeStatusUser = (data: IReqChangeStatus): Promise<IApiSuccessResponse> => {
    return instance.post<never, IApiSuccessResponse>('/api/v1/users/changeStatus', data);
};
