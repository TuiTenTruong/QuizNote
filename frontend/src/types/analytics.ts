import { IResBase } from "./api";

export interface ISubjectStat {
    subjectId: number;
    subjectName: string;
    count: number;
}

export interface IAccuracyBySubject {
    subjectId: number;
    subjectName: string;
    accuracy: number;
    totalQuestions?: number;
    correctAnswers?: number;
}

export interface IRecentActivity {
    date: string;
    quizCount: number;
    avgScore: number;
}

export interface IStudentAnalytics {
    totalQuizzesCompleted: number;
    averageAccuracy: number;
    activeDays: number;
    totalTimeSpent: number;
    subjectStats: ISubjectStat[];
    accuracyBySubject: IAccuracyBySubject[];
    recentActivity: IRecentActivity[];
}

export interface ISellerSubjectStat {
    subjectId: number;
    subjectName: string;
    purchaseCount: number;
    revenue: number;
    averageRating?: number;
}

export interface ISellerMonthlyStat {
    month: string;
    revenue: number;
    purchaseCount: number;
}

export interface ISellerAnalytics {
    totalRevenue: number;
    totalPurchases: number;
    totalSubjects: number;
    revenueThisMonth: number;
    purchasesThisMonth: number;
    subjectStats: ISellerSubjectStat[];
    monthlyStats: ISellerMonthlyStat[];
}

export interface IAdminStatusCard {
    title: string;
    value: number;
    change?: number;
}

export interface IAdminMonthlyRevenue {
    month: string;
    revenue: number;
}

export interface IAdminUserRoleCount {
    role: string;
    count: number;
}

export interface IAdminCurrentUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    joinDate: string;
}

export interface IAdminAnalytics {
    statusCards: IAdminStatusCard[];
    monthlyRevenues: IAdminMonthlyRevenue[];
    currentUsers: IAdminCurrentUser[];
    userRoleCounts: IAdminUserRoleCount[];
}

export interface IAdminDashboardStats {
    totalUsers: number;
    totalSubjects: number;
    totalQuestions: number;
    totalSubmissions: number;
    totalRevenue: number;
    newUsersThisMonth?: number;
    newSubjectsThisMonth?: number;
    recentOrders?: IAdminRecentOrder[];
}

export interface IAdminRecentOrder {
    id: number;
    buyerName: string;
    subjectName: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface IResGetStudentAnalytics extends IResBase<IStudentAnalytics, string> { }

export interface IResGetSellerAnalytics extends IResBase<ISellerAnalytics, string> { }

export interface IResGetAdminAnalytics extends IResBase<IAdminAnalytics, string> { }
