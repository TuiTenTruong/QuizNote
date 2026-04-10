import { toast } from "react-toastify";
import { login } from "../api/auth.api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { doLogin } from "../redux/action/userAction";
import type { IResLogin } from "../types/auth";
import { ROUTES, USER_ROLES } from "../sections/auth/constants";

type PasswordVisibility = 'password' | 'text';

export const handleToggle = (
    type: PasswordVisibility,
    setType: (val: PasswordVisibility) => void
): void => {
    setType(type === 'password' ? 'text' : 'password');
};


const navigateByRole = (roleName: string, navigate: ReturnType<typeof useNavigate>): void => {
    switch (roleName) {
        case USER_ROLES.SUPER_ADMIN:
            navigate(ROUTES.ADMIN);
            break;
        case USER_ROLES.SELLER:
            navigate(ROUTES.SELLER);
            break;
        case USER_ROLES.STUDENT:
        default:
            navigate(ROUTES.HOME);
            break;
    }
};


const handleLoginError = (response: IResLogin): void => {
    const errorMessage = response.message
        ? (Array.isArray(response.message) ? response.message.join(', ') : response.message)
        : "Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập của bạn.";

    toast.error(errorMessage);
};

const validateLoginInput = (email: string, password: string): string | null => {
    if (!email || !password) {
        return "Hãy điền đầy đủ thông tin!";
    }
    return null;
};

const isLoginSuccess = (response: IResLogin): boolean => {
    return Boolean(response && (response.statusCode === 200 || response.statusCode === 201));
};

const submitLogin = async (email: string, password: string): Promise<IResLogin> => {
    return login({
        username: email,
        password: password,
    });
};

const applyLoginSuccess = (
    response: IResLogin,
    dispatch: ReturnType<typeof useDispatch>,
    navigate: ReturnType<typeof useNavigate>
): void => {
    dispatch(doLogin(response.data));
    toast.success("Đăng nhập thành công!");
    navigateByRole(response.data.user.role.name, navigate);
};

export const useLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (
        email: string,
        password: string,
        e: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        const validationError = validateLoginInput(email, password);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await submitLogin(email, password);

            if (!isLoginSuccess(response)) {
                handleLoginError(response);
                return;
            }

            applyLoginSuccess(response, dispatch, navigate);
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
    };

    return {
        handleSubmit
    };
};
