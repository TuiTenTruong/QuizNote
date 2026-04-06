import instance from "./client";
import type {
    IResGetStudentAnalytics,
    IResGetSellerAnalytics,
    IResGetAdminAnalytics,
} from "../types/analytics";

// Get student analytics
export const getStudentAnalytics = (userId: number, days?: number | null): Promise<IResGetStudentAnalytics> => {
    const params = days ? `?days=${days}` : '';
    return instance.get<never, IResGetStudentAnalytics>(`/api/v1/submissions/analytics/user/${userId}${params}`);
};

// Get seller analytics
export const getSellerAnalytics = (sellerId: number, months?: number | null): Promise<IResGetSellerAnalytics> => {
    const params = months ? `?months=${months}` : '';
    return instance.get<never, IResGetSellerAnalytics>(`/api/v1/seller/analytics/${sellerId}${params}`);
};

// Get admin analytics
export const getAdminAnalytics = (): Promise<IResGetAdminAnalytics> => {
    return instance.get<never, IResGetAdminAnalytics>('/api/v1/admin/analysis');
};
