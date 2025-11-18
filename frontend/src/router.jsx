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
import SettingsPage from "./features/seller/SellerSettings";
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

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <HomePage /> },
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
        element: <ProtectedRoute allowedRoles={['STUDENT']}><DashboardStudent /></ProtectedRoute>,
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: "quizzes/:quizId", element: <StudentQuizDetail /> },
            { path: "quiz-payment/:quizId", element: <QuizPayment /> },
            { path: "payment-result", element: <PaymentResult /> },
            { path: "quizzes/:quizId/mode-select", element: <QuizModeSelect /> },
            { path: "quizzes/:quizId/exam", element: <ExamQuiz /> },
            { path: "quizzes/:quizId/practice", element: <QuizPracticePage /> },
            { path: "quizzes/my", element: <StudentMyQuizzes /> },
            { path: "history", element: <StudentHistory /> },
            { path: "history/quiz/:quizId", element: <StudentQuizHistoryDetail /> },
            { path: "analytics", element: <StudentAnalytics /> },
            { path: "settings", element: <SettingsPage /> }
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
        ]
    }

]);
export default router;