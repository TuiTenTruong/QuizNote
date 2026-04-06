import instance from "./client";
import type { IApiResponse, IApiSuccessResponse } from "../types/api";
import type {
    IReward,
    IRewardTransaction,
    IReqRedeemReward,
    IReqUpdateTransactionStatus,
    IResGetRewards,
    IResGetRewardsPaginated,
    IResGetReward,
    IResCreateReward,
    IResUpdateReward,
    IResDeleteReward,
    IResRedeemReward,
    IResGetRewardTransactions,
    IResUpdateTransactionStatus,
    RewardTransactionStatus,
} from "../types/reward";

// ============ USER ============

// Get available rewards
export const getAvailableRewards = (): Promise<IResGetRewards> => {
    return instance.get<never, IResGetRewards>('/api/v1/rewards/available');
};

// Redeem reward
export const redeemReward = (data: IReqRedeemReward): Promise<IResRedeemReward> => {
    return instance.post<never, IResRedeemReward>('/api/v1/rewards/redeem', data);
};

// Get my reward transactions
export const getMyRewardTransactions = (page: number = 0, size: number = 10): Promise<IResGetRewardTransactions> => {
    return instance.get<never, IResGetRewardTransactions>(`/api/v1/rewards/my-transactions?page=${page}&size=${size}`);
};

// ============ ADMIN ============

// Get all rewards (paginated)
export const getAllRewards = (page: number = 0, size: number = 10): Promise<IResGetRewardsPaginated> => {
    return instance.get<never, IResGetRewardsPaginated>(`/api/v1/rewards?page=${page}&size=${size}`);
};

// Get reward by id
export const getRewardById = (rewardId: number): Promise<IResGetReward> => {
    return instance.get<never, IResGetReward>(`/api/v1/rewards/${rewardId}`);
};

// Create reward
export const createReward = (formData: FormData): Promise<IResCreateReward> => {
    return instance.post<never, IResCreateReward>('/api/v1/rewards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Update reward
export const updateReward = (rewardId: number, formData: FormData): Promise<IResUpdateReward> => {
    return instance.put<never, IResUpdateReward>(`/api/v1/rewards/${rewardId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

// Delete reward
export const deleteReward = (rewardId: number): Promise<IResDeleteReward> => {
    return instance.delete<never, IResDeleteReward>(`/api/v1/rewards/${rewardId}`);
};

// Get all reward transactions (admin)
export const getAllRewardTransactions = (page: number = 0, size: number = 10): Promise<IResGetRewardTransactions> => {
    return instance.get<never, IResGetRewardTransactions>(`/api/v1/rewards/transactions?page=${page}&size=${size}`);
};

// Update transaction status
export const updateTransactionStatus = (
    transactionId: number,
    status: RewardTransactionStatus
): Promise<IResUpdateTransactionStatus> => {
    return instance.put<never, IResUpdateTransactionStatus>(
        `/api/v1/rewards/transactions/${transactionId}/status`,
        { status }
    );
};
