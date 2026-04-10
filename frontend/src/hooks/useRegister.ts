import { toast } from "react-toastify";
import { register } from "../api/auth.api";
import { IResRegister, UserGender, UserRole } from "../types";
import { useNavigate } from "react-router-dom";
import { USER_ROLES } from "../sections/auth/constants";

type PasswordVisibility = 'password' | 'text';

export const handleToggle = (
    type: PasswordVisibility,
    setType: (val: PasswordVisibility) => void
): void => {
    setType(type === 'password' ? 'text' : 'password');
};

export interface IRegisterInput {
    name: string;
    gender: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    bankName: string;
    bankAccount: string;
}

const validateRequiredFields = (input: IRegisterInput): string | null => {
    if (!input.name || !input.gender || !input.email || !input.password || !input.confirmPassword) {
        return "Hãy điền đầy đủ thông tin.";
    }
    return null;
};

const validatePasswordMatch = (input: IRegisterInput): string | null => {
    if (input.password !== input.confirmPassword) {
        return "Mật khẩu không khớp.";
    }
    return null;
};

const validateSellerBankInfo = (input: IRegisterInput): string | null => {
    if (input.role === USER_ROLES.SELLER && (!input.bankName || !input.bankAccount)) {
        return "Hãy điền đầy đủ thông tin ngân hàng cho tài khoản người bán.";
    }
    return null;
};

export const validateRegisterInput = (input: IRegisterInput): string | null => {
    return (
        validateRequiredFields(input) ||
        validatePasswordMatch(input) ||
        validateSellerBankInfo(input)
    );
};

const buildRegisterPayload = (input: IRegisterInput) => ({
    email: input.email,
    password: input.password,
    username: input.name,
    gender: input.gender as UserGender,
    role: input.role as UserRole,
    bankName: input.bankName || null,
    bankAccount: input.bankAccount || null
});

export const submitRegister = async (input: IRegisterInput): Promise<IResRegister> => {
    return register(buildRegisterPayload(input));
};

export const useRegister = () => {
    const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
        name: string,
        gender: string,
        email: string,
        password: string,
        confirmPassword: string,
        role: string,
        bankName: string,
        bankAccount: string
    ): Promise<void> => {
        e.preventDefault();

        const input: IRegisterInput = {
            name,
            gender,
            email,
            password,
            confirmPassword,
            role,
            bankName,
            bankAccount
        };

        const validationError = validateRegisterInput(input);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await submitRegister(input);
            if (response.data && (response.statusCode === 200 || response.statusCode === 201)) {
                toast.success(response.data.message);
                navigate("/login");
                return;
            }

            toast.error(String(response.message || "Đăng ký thất bại"));
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    return {
        handleSubmit
    };
};