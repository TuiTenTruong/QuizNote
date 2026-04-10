import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import SellerLayoutPage from "./pages/seller/SellerLayoutPage";
import SellerDashboardPage from "./pages/seller/SellerDashboardPage";
import SellerQuizzesPage from "./pages/seller/SellerQuizzesPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerAnalyticsPage from "./pages/seller/SellerAnalyticsPage";
import SellerWalletPage from "./pages/seller/SellerWalletPage";
import SettingsPage from "./features/settings/SettingsPage";
import CreateQuiz from "./features/quizzes/CreateQuiz";
import SellerQuizDetail from "./features/quizzes/seller/SellerQuizDetail";
import StudentQuizDetailPage from "./pages/student/StudentQuizDetailPage";
import StudentQuizPaymentPage from "./pages/student/StudentQuizPaymentPage";
import StudentPaymentResultPage from "./pages/student/StudentPaymentResultPage";
import QuizModeSelect from "./features/quizzes/student/QuizModeSelect";
import ExamQuiz from "./features/quizzes/student/ExamQuiz";
import QuizPracticePage from "./features/quizzes/student/QuizPracticePage";
import SellerSubjectDetailPage from "./pages/seller/SellerSubjectDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RewardShopPage from "./pages/reward/RewardShopPage";
import MyRewardTransactionsPage from "./pages/reward/MyRewardTransactionsPage";
import AboutPage from "./pages/about/AboutPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentMyQuizzesPage from "./pages/student/StudentMyQuizzesPage";
import StudentExplorePage from "./pages/student/StudentExplorePage";
import { StudentAnalyticPage } from "./pages/student/StudentAnalyticPage";
import { StudentHistoryPage } from "./pages/student/StudentHistoryPage";
import StudentHistoryDetailPage from "./pages/student/StudentHistoryDetailPage";
import StudentWeeklyQuizPage from "./pages/student/StudentWeeklyQuizPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminExplorePage from "./pages/admin/AdminExplorePage";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage";
import AdminSubjectsPage from "./pages/admin/AdminSubjectsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminRolesPermissionsPage from "./pages/admin/AdminRolesPermissionsPage";
import AdminRewardsPage from "./pages/admin/AdminRewardsPage";
import AdminRewardTransactionsPage from "./pages/admin/AdminRewardTransactionsPage";
import AdminWeeklyQuizPage from "./pages/admin/AdminWeeklyQuizPage";
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
                element: <ProtectedRoute allowedRoles={['STUDENT', 'SELLER', 'SUPER_ADMIN']}><MyRewardTransactionsPage /></ProtectedRoute>
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
        element: <StudentDashboardPage />,
        children: [
            { index: true, element: <StudentExplorePage /> },
            { path: "quizzes/:quizId", element: <StudentQuizDetailPage /> },

            { path: "weekly-quiz", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentWeeklyQuizPage /></ProtectedRoute> },
            { path: "quiz-payment/:quizId", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentQuizPaymentPage /></ProtectedRoute> },
            { path: "payment-result", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentPaymentResultPage /></ProtectedRoute> },
            { path: "quizzes/:quizId/mode-select", element: <ProtectedRoute allowedRoles={['STUDENT']}><QuizModeSelect /></ProtectedRoute> },
            { path: "quizzes/:quizId/exam", element: <ProtectedRoute allowedRoles={['STUDENT']}><ExamQuiz /></ProtectedRoute> },
            { path: "quizzes/:quizId/practice", element: <ProtectedRoute allowedRoles={['STUDENT']}><QuizPracticePage /></ProtectedRoute> },
            { path: "quizzes/my", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentMyQuizzesPage /></ProtectedRoute> },
            { path: "history", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentHistoryPage /></ProtectedRoute> },
            { path: "history/quiz/:quizId", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentHistoryDetailPage /></ProtectedRoute> },
            { path: "analytics", element: <ProtectedRoute allowedRoles={['STUDENT']}><StudentAnalyticPage /></ProtectedRoute> },
            { path: "settings", element: <ProtectedRoute allowedRoles={['STUDENT']}><SettingsPage /></ProtectedRoute> }
        ]
    },
    {
        path: "/seller",
        element: <ProtectedRoute allowedRoles={['SELLER']}><SellerLayoutPage /></ProtectedRoute>,
        children: [
            { index: true, element: <SellerDashboardPage /> },
            { path: "quizzes", element: <SellerQuizzesPage /> },
            { path: 'orders', element: <SellerOrdersPage /> },
            { path: 'analytics', element: <SellerAnalyticsPage /> },
            { path: 'wallet', element: <SellerWalletPage /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'quizzes/create', element: <CreateQuiz /> },
            { path: 'quizzes/:quizId', element: <SellerQuizDetail /> },
            { path: 'detail/:quizId', element: <SellerSubjectDetailPage /> }
        ]
    },
    {
        path: "/admin",
        element: <ProtectedRoute allowedRoles={['SUPER_ADMIN']}><AdminDashboardPage /></ProtectedRoute>,
        children: [
            { index: true, element: <AdminExplorePage /> },
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