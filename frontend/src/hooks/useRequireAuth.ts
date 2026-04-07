import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const defaultMessage = "Vui long dang nhap de tiep tuc.";

interface AuthAccount {
    id?: number | string;
    role?: string | { name?: string };
    [key: string]: unknown;
}

interface RootState {
    user?: {
        account?: AuthAccount | null;
    };
}

interface UseRequireAuthOptions {
    redirectTo?: string;
    fromPath?: string;
    message?: string;
}

const useRequireAuth = ({
    redirectTo = "/login",
    fromPath,
    message = defaultMessage,
}: UseRequireAuthOptions = {}) => {
    const account = useSelector((state: RootState) => state.user?.account);
    const navigate = useNavigate();
    const hasRedirectedRef = useRef<boolean>(false);

    useEffect(() => {
        if (account?.id) {
            hasRedirectedRef.current = false;
            return;
        }

        if (hasRedirectedRef.current) {
            return;
        }

        hasRedirectedRef.current = true;

        if (message) {
            toast.error(message);
        }

        navigate(
            redirectTo,
            fromPath ? { state: { from: fromPath } } : undefined
        );
    }, [account?.id, fromPath, message, navigate, redirectTo]);

    return {
        account,
        isAuthenticated: Boolean(account?.id),
    };
};

export default useRequireAuth;
