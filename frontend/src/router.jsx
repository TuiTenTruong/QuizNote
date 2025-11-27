import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./features/home/HomePage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import DashboardStudent from "./features/student/Dashboard";
import DashboardSeller from "./features/seller/Dashboard";
import DashboardAdmin from "./features/admin/Dashboard";
import SellerDashboard from "./features/seller/SellerDashboardPage";
import SellerQuizzes from "./features/seller/SellerQuizzes";
import SellerOrders from "./features/seller/SellerOrders";
import SellerAnalytics from "./features/seller/SellerAnalytics";
import SellerWallet from "./features/seller/SellerWallet";
import SettingsPage from "./features/settings/SettingsPage";
import CreateQuiz from "./features/quizzes/CreateQuiz";
import SellerQuizDetail from "./features/quizzes/seller/SellerQuizDetail";
import StudentDashboard from "./features/quizzes/student/StudentQuizDashboard";
import StudentQuizDetail from "./features/quizzes/student/StudentQuizDetail";
import QuizPayment from "./features/payment/QuizPayment";
import PaymentResult from "./features/payment/PaymentResult";
import QuizModeSelect from "./features/quizzes/student/QuizModeSelect";
import ExamQuiz from "./features/quizzes/student/ExamQuiz";
import QuizPracticePage from "./features/quizzes/student/QuizPracticePage";
import StudentMyQuizzes from "./features/student/StudentMyQuizzes";
import StudentHistory from "./features/student/StudentHistory";
import StudentQuizHistoryDetail from "./features/student/StudentQuizHistoryDetail";
import StudentAnalytics from "./features/student/StudentAnalytics";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminUsersPage from "./features/admin/AdminUsersPage";
import AdminSubjectsPage from "./features/admin/AdminSubjectsPage";
import AdminRolesPermissionsPage from "./features/admin/AdminRolesPermissionsPage";
import SellerSubjectDetailPage from "./features/seller/SellerSubjectDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminOrdersPage from "./features/admin/AdminOrdersPage";
import WeeklyQuizPage from "./features/weeklyquiz/WeeklyQuizPage";
import AdminWeeklyQuizPage from "./features/weeklyquiz/AdminWeeklyQuizPage";
import RewardShopPage from "./features/reward/RewardShopPage";
import AdminRewardsPage from "./features/admin/AdminRewardsPage";
import AdminRewardTransactionsPage from "./features/admin/AdminRewardTransactionsPage";
import MyRewardTransactions from "./features/reward/MyRewardTransactions";
import AboutPage from "./features/about/AboutPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
            {
                path: "/rewards",
                element: <RewardShopPage />
            },
            {
                path: "/my-reward-transactions",
                element: <ProtectedRoute allowedRoles={['STUDENT', 'SELLER', 'SUPER_ADMIN']}><MyRewardTransactions /></ProtectedRoute>
            },
            {
                path: "/about",
                element: <AboutPage />
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage />
    },
    {
        path: "/register",
        element: <RegisterPage />
    },

    {
        path: "/student",
        element: <DashboardStudent />,
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: "quizzes/:quizId", element: <StudentQuizDetail /> },

            { path: "weekly-quiz", element: <ProtectedRoute allowedRoles={['STUDENT']}><WeeklyQuizPage /></ProtectedRoute> },
            { path: "quiz-payment/:quizId", element: <ProtectedRoute allowedRoles={['STUDENT']}><QuizPayment /></ProtectedRoute> },
            { path: "payment-result", element: <ProtectedRoute allowedRoles={['STUDENT']}><PaymentResult /></ProtectedRoute> },
            { path: "quizzes/:quizId/mode-select", element: <ProtectedRoute allowedRoles={['STUDENT']}><QuizModeSelect /></ProtectedRoute> },
            { path: "quizzes/:quizId/exam", element: <ProtectedRoute allowedRoles={['STUDENT']}><ExamQuiz /></ProtectedRoute> },
            { path: "quizzes/:quizId/practice", element: <ProtectedRoute allowedRoles={['STUDENT']}><QuizPracticePage /></ProtectedRoute> },
            { path: "quizzes/my", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentMyQuizzes /></ProtectedRoute> },
            { path: "history", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentHistory /></ProtectedRoute> },
            { path: "history/quiz/:quizId", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentQuizHistoryDetail /></ProtectedRoute> },
            { path: "analytics", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentAnalytics /></ProtectedRoute> },
            { path: "settings", element: <ProtectedRoute allowedRoles={['STUDENT']}><SettingsPage /></ProtectedRoute> }
        ]
    },
    {
        path: "/seller",
        element: <ProtectedRoute allowedRoles={['SELLER']}><DashboardSeller /></ProtectedRoute>,
        children: [
            { index: true, element: <SellerDashboard /> },
            { path: "quizzes", element: <SellerQuizzes /> },
            { path: 'orders', element: <SellerOrders /> },
            { path: 'analytics', element: <SellerAnalytics /> },
            { path: 'wallet', element: <SellerWallet /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'quizzes/create', element: <CreateQuiz /> },
            { path: 'quizzes/:quizId', element: <SellerQuizDetail /> },
            { path: 'detail/:quizId', element: <SellerSubjectDetailPage /> }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><DashboardAdmin /></ProtectedRoute>,
        children: [
            { index: true, element: <AdminDashboard /> },
            { path: "users", element: <AdminUsersPage /> },
            { path: "permissions", element: <AdminRolesPermissionsPage /> },
            { path: "subjects", element: <AdminSubjectsPage /> },
            { path: "orders", element: <AdminOrdersPage /> },
            { path: "weekly-quizzes", element: <AdminWeeklyQuizPage /> },
            { path: "settings", element: <SettingsPage /> },
            { path: "rewards", element: <AdminRewardsPage /> },
            { path: "rewards/transactions", element: <AdminRewardTransactionsPage /> }
        ]
    }

]);
export default router;