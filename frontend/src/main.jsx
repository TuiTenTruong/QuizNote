import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import HomePage from './features/home/HomePage.jsx';
import RegisterPage from './features/auth/RegisterPage.jsx';
import LoginPage from './features/auth/LoginPage.jsx';
import SellerDashboard from './features/seller/SellerDashboardPage.jsx';
import Dashboard from './features/seller/Dashboard.jsx';
import SellerQuizzes from './features/seller/SellerQuizzes.jsx';
import SellerOrders from './features/seller/SellerOrders.jsx';
import SellerAnalytics from './features/seller/SellerAnalytics.jsx';
import SellerWallet from './features/seller/SellerWallet.jsx';
import SettingsPage from './features/seller/SellerSettings.jsx';
import SellerQuizDetail from './features/quizzes/seller/SellerQuizDetail.jsx';
import CreateQuiz from './features/quizzes/CreateQuiz.jsx';
import StudentDashboard from './features/quizzes/student/StudentQuizDashboard.jsx';
import StudentQuizDetail from './features/quizzes/student/StudentQuizDetail.jsx';
import QuizPayment from './features/payment/QuizPayment.jsx';

const root = document.getElementById('root');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-quizzes/:quizId" element={<StudentQuizDetail />} />
        <Route path="/quiz-payment" element={<QuizPayment />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<SellerDashboard />} />
          <Route path="quizzes" element={<SellerQuizzes />} />
          <Route path='orders' element={<SellerOrders />} />
          <Route path='analytics' element={<SellerAnalytics />} />
          <Route path='wallet' element={<SellerWallet />} />
          <Route path='settings' element={<SettingsPage />} />
          <Route path='quizzes/create' element={<CreateQuiz />} />
          <Route path='quizzes/:quizId' element={<SellerQuizDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
