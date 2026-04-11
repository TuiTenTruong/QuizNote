import type { ChangeEvent } from "react";

export type Gender = "MALE" | "FEMALE" | "OTHER";
export type SettingsTab = "Thông tin cá nhân" | "Tài khoản";

export interface UserProfile {
    name: string;
    age: number;
    address: string;
    gender: Gender;
    bio: string;
}

export interface UserData {
    email: string;
    avatarUrl?: string;
    name?: string;
    age?: number;
    address?: string;
    gender?: Gender;
    bio?: string;
}

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ApiResponse<T> {
    statusCode?: number;
    message?: string;
    data?: T;
}

export type ProfileChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
export type PasswordChangeEvent = ChangeEvent<HTMLInputElement>;
