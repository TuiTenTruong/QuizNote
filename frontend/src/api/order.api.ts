import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    IOrder,
    IOrderPagination,
    IPurchase,
    IResGetOrders,
    IResGetPurchases,
    IResGetAdminOrders,
} from "../types/order";

// Get user's purchases (my quizzes)
export const getUserPurchases = (userId: number): Promise<IResGetPurchases> => {
    return instance.get<never, IResGetPurchases>(`/api/v1/purchases/user/${userId}`);
};

// Get seller's orders
export const getSellerOrders = (
    sellerId: number,
    page: number = 0,
    size: number = 10
): Promise<IResGetOrders> => {
    return instance.get<never, IResGetOrders>(`/api/v1/seller/orders/${sellerId}?page=${page}&size=${size}`);
};

// Get seller's recent orders for a subject
export const getSellerRecentOrders = (subjectId: number): Promise<IApiResponse<IOrder[]>> => {
    return instance.get<never, IApiResponse<IOrder[]>>(`/api/v1/seller/recentOrder/${subjectId}`);
};

// Get all admin orders
export const getAdminOrders = (): Promise<IResGetAdminOrders> => {
    return instance.get<never, IResGetAdminOrders>('/api/v1/admin/orders');
};
