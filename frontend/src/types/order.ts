import { IResBase } from "./api";
import { IPaginationMeta } from "./pagination";
import { ISubject } from "./subject";

export type OrderStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface IOrderBuyer {
    id: number;
    name: string;
    email: string;
}

export interface IOrderSubject {
    id: number;
    name: string;
}

export interface IOrder {
    id: number;
    buyer: IOrderBuyer;
    subject: IOrderSubject;
    amount: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt?: string;
}

export interface IOrderPagination {
    meta: IPaginationMeta;
    result: IOrder[];
}

export interface IPurchase {
    id: number;
    userId: number;
    subjectId: number;
    subject: ISubject;
    purchaseDate: string;
    amount: number;
    status: OrderStatus;
}

export interface IResGetOrders extends IResBase<IOrderPagination, string> { }

export interface IResGetPurchases extends IResBase<IPurchase[], string> { }

export interface IResGetAdminOrders extends IResBase<IOrder[], string> { }
