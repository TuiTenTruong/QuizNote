import instance from "./client";
import type {
    IVNPayOrder,
    IResVNPayCreateOrder,
} from "../types/payment";

// Create VNPay order
export const createVNPayOrder = (amount: number, orderInfo: string): Promise<IResVNPayCreateOrder> => {
    return instance.post<never, IResVNPayCreateOrder>(
        `/api/v1/payments/vnpay/submitOrder?amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}`
    );
};
