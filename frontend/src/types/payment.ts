import { IResBase } from "./api";

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export type PaymentMethod = 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'BANK_TRANSFER';

export interface IPayment {
    id: number;
    userId: number;
    subjectId: number;
    amount: number;
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
    orderInfo?: string;
    createdAt: string;
    paidAt?: string;
}

export interface IVNPayOrder {
    orderId: string;
    paymentUrl: string;
    amount: number;
    orderInfo: string;
}

export interface IVNPayResult {
    vnp_ResponseCode: string;
    vnp_TransactionNo?: string;
    vnp_Amount?: string;
    vnp_OrderInfo?: string;
    vnp_TxnRef?: string;
    vnp_BankCode?: string;
    vnp_PayDate?: string;
    success: boolean;
    message: string;
}

export interface IReqVNPayCreateOrder {
    amount: number;
    orderInfo: string;
}

export interface IResVNPayCreateOrder extends IResBase<IVNPayOrder, string> { }

export interface IResPaymentResult extends IResBase<IVNPayResult, string> { }
