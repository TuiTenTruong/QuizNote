import {
    changePassword,
    getCurrentUser,
    updateUserProfile,
    uploadAvatar
} from "../services/apiService";
import axiosInstance from "../utils/axiosCustomize";
import type { ApiResponse, UserData, UserProfile } from "../types/settings.types";

const backendBaseURL = `${axiosInstance.defaults.baseURL}storage/users/`;

export const fetchCurrentUserApi = async (): Promise<ApiResponse<UserData>> => {
    return getCurrentUser();
};

export const updateUserProfileApi = async (profileData: UserProfile): Promise<ApiResponse<UserData>> => {
    return updateUserProfile(profileData);
};

export const changePasswordApi = async (
    currentPassword: string,
    newPassword: string
): Promise<ApiResponse<unknown>> => {
    return changePassword(currentPassword, newPassword);
};

export const uploadAvatarApi = async (email: string, file: File): Promise<ApiResponse<unknown>> => {
    return uploadAvatar(email, file);
};

export const buildAvatarUrl = (avatarPath: string): string => `${backendBaseURL}${avatarPath}`;
