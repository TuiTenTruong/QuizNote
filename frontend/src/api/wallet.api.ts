import instance from "./client";
import type { IApiResponse } from "../types/api";
import type {
    ISellerWallet,
    IWithdrawHistory,
    IReqWithdraw,
    IResGetWallet,
    IResWithdraw,
} from "../types/wallet";

// Get seller wallet
export const getSellerWallet = (sellerId: number): Promise<IResGetWallet> => {
    return instance.get<never, IResGetWallet>(`/api/v1/seller/getWallet/${sellerId}`);
};

// Withdraw from seller wallet
export const withdraw = (data: IReqWithdraw): Promise<IResWithdraw> => {
    return instance.post<never, IResWithdraw>('/api/v1/withdraw', data);
};
