import axios from "axios";
import { store } from "../redux/store";
import { toast } from "react-toastify";

// Create a navigation event system
let navigateFunction = null;

export const setNavigate = (navigateFn) => {
    navigateFunction = navigateFn;
};

const instance = axios.create({
    baseURL: 'http://localhost:8080/'

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
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
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

        // Redirect to login page after 2 seconds
        setTimeout(() => {
            if (navigateFunction) {
                navigateFunction('/login');
            }
        }, 2000);

        return Promise.reject(error);
    }

    // Handle 401 Unauthorized
    if (error?.response?.status === 401) {
        // Check if current path is a public route that doesn't require authentication
        const currentPath = window.location.pathname;
        const publicRoutes = ['/', '/student/quizzes/', '/login', '/register'];
        const isPublicRoute = publicRoutes.some(route =>
            currentPath === route || currentPath.startsWith(route)
        );

        // Only redirect to login and show error for protected routes
        if (!isPublicRoute) {
            toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.", {
                position: "top-right",
            });

            localStorage.removeItem('access_token');
            localStorage.removeItem('user');

            setTimeout(() => {
                if (navigateFunction) {
                    navigateFunction('/login');
                }
            }, 1500);
        }
    }

    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error && error.response && error.response.data ? error.response.data : Promise.reject(error);
});

export default instance