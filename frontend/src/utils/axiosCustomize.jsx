import axios from "axios";
import { store } from "../redux/store";
import { doLogin, doLogout } from "../redux/action/userAction";
import { toast } from "react-toastify";

// Create a navigation event system
let navigateFunction = null;

export const setNavigate = (navigateFn) => {
    navigateFunction = navigateFn;
};

// Track if we're currently refreshing token to avoid multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const instance = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true // Important for sending cookies
})
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    const access_token = store?.getState()?.user?.account?.access_token;
    if (access_token) {
        config.headers['Authorization'] = "Bearer " + access_token;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
    return response && response.data ? response.data : response;
}, function (error) {
    // Handle account disabled error
    if (error?.response?.data?.error === "Account disabled") {
        const message = error.response.data.message || "Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.";

        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
        });

        // Clear user data from localStorage and redux store
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        store.dispatch(doLogout());

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            if (navigateFunction) {
                navigateFunction('/login');
            }
        }, 2000);

        return Promise.reject(error);
    }

    // Handle session expired error (logged in on another device)
    if (error?.response?.data?.error === "Session expired") {
        const message = error.response.data.message || "Tài khoản đã đăng nhập ở thiết bị khác hoặc phiên đã hết hạn";

        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
        });

        // Clear user data from localStorage and redux store
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        store.dispatch(doLogout());

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            if (navigateFunction) {
                navigateFunction('/login');
            }
        }, 2000);

        return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (error?.response?.status === 401) {
        const originalRequest = error.config;
        if (originalRequest.url && originalRequest.url.includes('/auth/refresh')) {
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

            return instance.get('/api/v1/auth/refresh')
                .then(res => {
                    if (res && res.data.access_token) {
                        // Update Redux store with new tokens
                        store.dispatch(doLogin({
                            access_token: res.data.access_token,
                            refreshToken: res.data.refreshToken,
                            user: res.data.user
                        }));

                        // Update localStorage
                        localStorage.setItem('access_token', res.data.access_token);
                        localStorage.setItem('user', JSON.stringify(res.data.user));

                        // Update the failed request with new token
                        originalRequest.headers['Authorization'] = 'Bearer ' + res.data.access_token;

                        // Process queued requests
                        processQueue(null, res.data.access_token);

                        isRefreshing = false;
                        // Retry the original request
                        return instance(originalRequest);
                    }
                })
                .catch(err => {
                    // Refresh token failed - logout user
                    processQueue(err, null);
                    isRefreshing = false;

                    toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
                        position: "top-right",
                    });

                    localStorage.removeItem('access_token');
                    localStorage.removeItem('user');
                    store.dispatch(doLogout());

                    setTimeout(() => {
                        if (navigateFunction) {
                            navigateFunction('/login');
                        }
                    }, 1500);

                    return Promise.reject(err);
                });
        }

        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
        }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return instance(originalRequest);
        }).catch(err => {
            return Promise.reject(err);
        });
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error && error.response && error.response.data ? error.response.data : Promise.reject(error);
});

export default instance