import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { doLogout } from "../redux/action/userAction";
import {
    buildAvatarUrl,
    changePasswordApi,
    fetchCurrentUserApi,
    updateUserProfileApi,
    uploadAvatarApi
} from "../api/setting.api";
import { UserProfile, PasswordData, UserData, ApiResponse, ProfileChangeEvent, PasswordChangeEvent } from "../types/settings.types";


const defaultProfileData: UserProfile = {
    name: "",
    age: 0,
    address: "",
    gender: "MALE",
    bio: ""
};

const defaultPasswordData: PasswordData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
};

export const useSettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [profileData, setProfileData] = useState<UserProfile>(defaultProfileData);
    const [passwordData, setPasswordData] = useState<PasswordData>(defaultPasswordData);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getApiErrorMessage = (error: unknown, fallbackMessage: string) => {
        const apiError = error as { response?: { data?: ApiResponse<unknown> } };
        return apiError.response?.data?.message || fallbackMessage;
    };

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchCurrentUserApi();
            if (response?.data) {
                const data = response.data;
                setUserData(data);
                setProfileData({
                    name: data.name ?? "",
                    age: data.age ?? 0,
                    address: data.address ?? "",
                    gender: data.gender ?? "MALE",
                    bio: data.bio ?? ""
                });
                if (data.avatarUrl) {
                    setAvatarPreview(buildAvatarUrl(data.avatarUrl));
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Lỗi khi tải thông tin người dùng");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchUserData();
    }, [fetchUserData]);

    const handleProfileChange = (e: ProfileChangeEvent) => {
        const { name, value } = e.target;

        if (name === "age") {
            setProfileData((prev) => ({
                ...prev,
                age: Number(value) || 0
            }));
            return;
        }

        if (name === "name" || name === "address" || name === "bio") {
            setProfileData((prev) => ({
                ...prev,
                [name]: value
            }));
            return;
        }

        if (name === "gender" && (value === "MALE" || value === "FEMALE" || value === "OTHER")) {
            setProfileData((prev) => ({
                ...prev,
                gender: value
            }));
        }
    };

    const handlePasswordChange = (e: PasswordChangeEvent) => {
        const { name, value } = e.target;
        if (name === "currentPassword" || name === "newPassword" || name === "confirmPassword") {
            setPasswordData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Kích thước file phải nhỏ hơn 5MB");
            return;
        }

        setAvatarFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                setAvatarPreview(reader.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleUploadAvatar = async () => {
        if (!avatarFile) {
            toast.warning("Vui lòng chọn ảnh trước");
            return;
        }
        if (!userData?.email) {
            toast.error("Không tìm thấy email người dùng");
            return;
        }

        try {
            setLoading(true);
            const response = await uploadAvatarApi(userData.email, avatarFile);
            if (response?.statusCode === 200 && response.data) {
                toast.success("Cập nhật ảnh đại diện thành công!");
                setAvatarFile(null);
                await fetchUserData();
            } else {
                toast.error(response?.message || "Lỗi khi tải ảnh đại diện");
            }
        } catch (error: unknown) {
            console.error("Error uploading avatar:", error);
            toast.error(getApiErrorMessage(error, "Lỗi khi tải ảnh đại diện"));
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const response = await updateUserProfileApi(profileData);
            if (response?.data) {
                toast.success("Cập nhật thông tin cá nhân thành công!");
                await fetchUserData();
            }
        } catch (error: unknown) {
            console.error("Error updating profile:", error);
            toast.error(getApiErrorMessage(error, "Lỗi khi cập nhật thông tin cá nhân"));
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passwordData.currentPassword || !passwordData.newPassword) {
            toast.warning("Vui lòng điền đầy đủ các trường mật khẩu");
            return;
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Mật khẩu mới không khớp");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        try {
            setLoading(true);
            const response = await changePasswordApi(passwordData.currentPassword, passwordData.newPassword);
            if (response?.statusCode === 400) {
                toast.error(response.message || "Lỗi khi đổi mật khẩu");
            } else {
                toast.success("Đổi mật khẩu thành công!");
                setPasswordData(defaultPasswordData);
            }
        } catch (error: unknown) {
            console.error("Error changing password:", error);
            toast.error(getApiErrorMessage(error, "Lỗi khi đổi mật khẩu"));
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(doLogout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    return {
        loading,
        userData,
        profileData,
        passwordData,
        avatarFile,
        avatarPreview,
        handleProfileChange,
        handlePasswordChange,
        handleAvatarChange,
        handleUploadAvatar,
        handleSaveProfile,
        handleChangePassword,
        handleLogout
    };
};
