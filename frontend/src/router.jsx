import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./features/home/HomePage";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import DashboardStudent from "./features/student/Dashboard";
import DashboardSeller from "./features/seller/Dashboard";
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
import QuizModeSelect from "./features/quizzes/student/QuizModeSelect";
import ExamQuiz from "./features/quizzes/student/ExamQuiz";
import QuizPracticePage from "./features/quizzes/student/QuizPracticePage";
import StudentMyQuizzes from "./features/student/StudentMyQuizzes";
import StudentHistory from "./features/student/StudentHistory";
import StudentQuizHistoryDetail from "./features/student/StudentQuizHistoryDetail";
import StudentAnalytics from "./features/student/StudentAnalytics";
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
        element: <DashboardStudent />,
        children: [
            { index: true, element: <StudentDashboard /> },
            { path: "quizzes/:quizId", element: <StudentQuizDetail /> },
            { path: "quiz-payment", element: <QuizPayment /> },
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
        element: <DashboardSeller />,
        children: [
            { index: true, element: <SellerDashboard /> },
            { path: "quizzes", element: <SellerQuizzes /> },
            { path: 'orders', element: <SellerOrders /> },
            { path: 'analytics', element: <SellerAnalytics /> },
            { path: 'wallet', element: <SellerWallet /> },
            { path: 'settings', element: <SettingsPage /> },
            { path: 'quizzes/create', element: <CreateQuiz /> },
            { path: 'quizzes/:quizId', element: <SellerQuizDetail /> },
        ]
    },

]);
export default router;