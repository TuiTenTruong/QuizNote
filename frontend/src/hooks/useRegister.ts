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

export const useRegister = () => {
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, name: string, gender: string, email: string, password: string, confirmPassword: string, role: string, bankName: string, bankAccount: string): Promise<void> => {
        e.preventDefault();

        if (!name || !gender || !email || !password || !confirmPassword) {
            toast.error("Hãy điền đầy đủ thông tin.");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Mật khẩu không khớp.");
            return;
        }

        if (role === USER_ROLES.SELLER) {
            if (!bankName || !bankAccount) {
                toast.error("Hãy điền đầy đủ thông tin ngân hàng cho tài khoản người bán.");
                return;
            }
        }

        const response: IResRegister = await register({
            email: email,
            password: password,
            username: name,
            gender: gender as UserGender,
            role: role as UserRole,
            bankName: bankName || null,
            bankAccount: bankAccount || null
        });
        console.log(response);
        if (response.data && (response.statusCode === 200 || response.statusCode === 201)) {

            toast.success(response.data.message);
            navigate("/login");
        } else {
            toast.error(response.message);
        }
    }
    return {
        handleSubmit
    };
}