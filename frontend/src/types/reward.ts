import { IPaginationMeta } from "./pagination";
import { IResBase } from "./api";

export type RewardTransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
export type RewardFilterStatus = 'All' | 'Active' | 'Inactive' | 'InStock' | 'OutOfStock';
export type RewardModalType = '' | 'create' | 'edit' | 'delete';

export interface IReward {
    id: number;
    name: string;
    description: string;
    cost: number;
    imageUrl: string;
    inStock: boolean;
    active?: boolean;
    isActive?: boolean;
    stockQuantity?: number;
    quantity?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface IRewardFormData {
    name: string;
    description: string;
    cost: string;
    stockQuantity: string;
    inStock: boolean;
    active: boolean;
}

export interface IRewardPagination {
    meta: IPaginationMeta;
    result: IReward[];
}

export interface IRewardTransaction {
    id: number;
    rewardId: number;
    reward: IReward;
    userId: number;
    user?: {
        name?: string;
        email?: string;
    };
    userName?: string;
    userEmail?: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    deliveryInfo?: string;
    coinsCost?: number;
    redeemedAt?: string;
    status: RewardTransactionStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface IRewardTransactionPagination {
    meta: IPaginationMeta;
    result: IRewardTransaction[];
}

export interface IReqCreateReward {
    name: string;
    description: string;
    cost: number;
    quantity?: number;
}

export interface IReqUpdateReward extends Partial<IReqCreateReward> {
    id: number;
}

export interface IReqRedeemReward {
    rewardId: number;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
}

export interface IReqUpdateTransactionStatus {
    status: RewardTransactionStatus;
}

export interface IRewardRedeemRecipient {
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
}

export interface IRewardDeliveryInfo {
    name: string;
    phone: string;
    address: string;
}

export interface IRewardUiAlert {
    type: 'success' | 'danger' | 'warning' | 'info';
    text: string;
}

export interface IResGetRewards extends IResBase<IReward[], string> { }

export interface IResGetRewardsPaginated extends IResBase<IRewardPagination, string> { }

export interface IResGetReward extends IResBase<IReward, string> { }

export interface IResCreateReward extends IResBase<IReward> { }

export interface IResUpdateReward extends IResBase<IReward> { }

export interface IResDeleteReward extends IResBase<null, string> { }

export interface IResRedeemReward extends IResBase<IRewardTransaction> { }

export interface IResGetRewardTransactions extends IResBase<IRewardTransactionPagination, string> { }

export interface IResUpdateTransactionStatus extends IResBase<IRewardTransaction> { }
