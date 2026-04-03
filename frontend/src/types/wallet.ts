import { IResBase } from "./api";

export type WithdrawStatus = 'Pending' | 'Completed' | 'Failed';

export interface IWithdrawHistory {
    id: number;
    sellerId: number;
    amount: number;
    status: WithdrawStatus;
    requestedAt: string;
    processedAt?: string;
    bankName?: string;
    bankAccount?: string;
}

export interface ISellerWallet {
    totalEarnings: number;
    earnThisMonth: number;
    availableBalance: number;
    pendingBalance: number;
    withdrawHistories: IWithdrawHistory[];
}

export interface IReqWithdraw {
    sellerId: number;
    amount: number;
}

export interface IResGetWallet extends IResBase<ISellerWallet, string> { }

export interface IResWithdraw extends IResBase<IWithdrawHistory> { }
