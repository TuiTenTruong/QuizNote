import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { store } from "../redux/store";
import { doLogin, doLogout } from "../redux/action/userAction";
import { toast } from "react-toastify";
import type { IApiResponse } from "../types/api";
import type { IAuthPayload } from "../types/auth";

// Navigation function type
type NavigateFunction = (path: string) => void;

// Create a navigation event system
let navigateFunction: NavigateFunction | null = null;

export const setNavigate = (navigateFn: NavigateFunction): void => {
    navigateFunction = navigateFn;
};

// Queue item for failed requests during token refresh
interface QueueItem {
    resolve: (value: string | PromiseLike<string>) => void;
    reject: (reason?: unknown) => void;
}

// Track if we're currently refreshing token to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown | null, token: string | null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true // Important for sending cookies
});

// Add a request interceptor
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const access_token = store?.getState()?.user?.account?.access_token;
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    (error: AxiosError): Promise<never> => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse['data'] => {
        return response.data;
    },
    async (error: AxiosError<IApiResponse<unknown>>): Promise<unknown> => {
        const errorData = error?.response?.data;
        const originalRequest = error.config;

        // Handle account disabled error
        if (errorData?.error === "Account disabled") {
            const message = (errorData.message as string) || "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.";

            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            store.dispatch(doLogout());

            setTimeout(() => {
                navigateFunction?.('/login');
            }, 2000);

            return Promise.reject(error);
        }

        // Handle session expired error (logged in on another device)
        if (errorData?.error === "Session expired") {
            const message = (errorData.message as string) || "Tài khoản đã đăng nhập ở thiết bị khác hoặc phiên đã hết hạn";

            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            store.dispatch(doLogout());

            setTimeout(() => {
                navigateFunction?.('/login');
            }, 2000);

            return Promise.reject(error);
        }

        // Handle 401 Unauthorized - Try to refresh token
        if (error?.response?.status === 401 && originalRequest) {
            if (originalRequest.url?.includes('/auth/refresh')) {
                return Promise.reject(error);
            }

            const currentPath = window.location.pathname;
            const publicRoutes = ['/login', '/register'];
            const publicPrefixes = ['/student/quizzes'];

            const isPublicRoute =
                currentPath === '/' ||
                publicRoutes.includes(currentPath) ||
                publicPrefixes.some(prefix => currentPath.startsWith(prefix));

            if (isPublicRoute) {
                return Promise.reject(error);
            }

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const res = await instance.get<IApiResponse<IAuthPayload>>('/api/v1/auth/refresh');
                    const refreshData = res as unknown as IApiResponse<IAuthPayload>;

                    if (refreshData?.data?.access_token) {
                        const { access_token, refreshToken, user } = refreshData.data;

                        store.dispatch(doLogin({ access_token, refreshToken, user }));
                        localStorage.setItem('access_token', access_token);
                        localStorage.setItem('user', JSON.stringify(user));

                        originalRequest.headers.Authorization = `Bearer ${access_token}`;
                        processQueue(null, access_token);
                        isRefreshing = false;

                        return instance(originalRequest);
                    }
                } catch (err) {
                    processQueue(err, null);
                    isRefreshing = false;

                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
                        position: "top-right",
                    });

                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    store.dispatch(doLogout());

                    setTimeout(() => {
                        navigateFunction?.('/login');
                    }, 1500);

                    return Promise.reject(err);
                }
            }

            // If already refreshing, queue this request
            return new Promise<string>((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
            });
        }

        // Return error data or reject
        return errorData ?? Promise.reject(error);
    }
);

export default instance;