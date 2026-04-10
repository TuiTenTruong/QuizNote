import { useCallback, useEffect, useMemo, useState } from 'react';
import { getAdminOrders } from '../api/order.api';
import type {
    IAdminOrder,
    AdminOrderFilterStatus,
    IAdminOrderStats,
    AdminOrderStatus,
    IAdminOrdersPayload
} from '../types/order';

const INITIAL_STATS: IAdminOrderStats = {
    totalOrders: 0,
    successfulOrders: 0,
    totalRevenue: 0,
    platformFee: 0
};

const toNumber = (value: unknown): number => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

export const useOrderQuery = () => {
    const [orders, setOrders] = useState<IAdminOrder[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<IAdminOrderStats>(INITIAL_STATS);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await getAdminOrders();
            const payload = response?.data as IAdminOrder[] | IAdminOrdersPayload | undefined;

            const orderList = Array.isArray(payload) ? payload : payload?.orders ?? [];
            const normalizedOrders = orderList.map((order) => ({
                ...order,
                amount: toNumber(order.amount)
            }));

            const successCount = normalizedOrders.filter((order) => order.status === 'SUCCESS').length;
            const totalRevenue = normalizedOrders.reduce((sum, order) => sum + toNumber(order.amount), 0);

            setOrders(normalizedOrders);
            setStats({
                totalOrders: payload && !Array.isArray(payload) ? payload.totalOrders ?? normalizedOrders.length : normalizedOrders.length,
                successfulOrders: payload && !Array.isArray(payload) ? payload.successfulOrders ?? successCount : successCount,
                totalRevenue: payload && !Array.isArray(payload) ? payload.totalRevenue ?? totalRevenue : totalRevenue,
                platformFee:
                    payload && !Array.isArray(payload)
                        ? payload.platformFee ?? Math.round(totalRevenue * 0.15)
                        : Math.round(totalRevenue * 0.15)
            });
        } catch (fetchError) {
            console.error('Error fetching admin orders:', fetchError);
            setError('Khong the tai du lieu don hang. Vui long thu lai sau.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    return {
        orders,
        loading,
        error,
        stats,
        fetchOrders
    };
};

export const useOrderFilter = (orders: IAdminOrder[]) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<AdminOrderFilterStatus>('All');

    const filteredOrders = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();

        return orders.filter((order) => {
            const matchSearch =
                !search ||
                String(order.transactionNo ?? '').toLowerCase().includes(search) ||
                String(order.buyer?.name ?? '').toLowerCase().includes(search) ||
                String(order.subject?.name ?? '').toLowerCase().includes(search);

            const matchStatus = filterStatus === 'All' || order.status === filterStatus;
            return matchSearch && matchStatus;
        });
    }, [orders, searchTerm, filterStatus]);

    const isKnownStatus = useCallback((status: string): status is AdminOrderStatus => {
        return status === 'PENDING' || status === 'SUCCESS' || status === 'FAILED' || status === 'CANCELLED';
    }, []);

    const handleFilterStatusChange = useCallback(
        (status: string) => {
            if (status === 'All' || isKnownStatus(status)) {
                setFilterStatus(status as AdminOrderFilterStatus);
            }
        },
        [isKnownStatus]
    );

    return {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus: handleFilterStatusChange,
        filteredOrders
    };
};

export const useOrderDetailFeature = () => {
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [selectedOrder, setSelectedOrder] = useState<IAdminOrder | null>(null);

    const handleViewDetails = useCallback((order: IAdminOrder) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    }, []);

    const closeDetailModal = useCallback(() => {
        setShowDetailModal(false);
        setSelectedOrder(null);
    }, []);

    return {
        showDetailModal,
        selectedOrder,
        handleViewDetails,
        closeDetailModal
    };
};

export const useOrderFormatters = () => {
    const formatPaymentTime = useCallback((timeStr?: string | null): string => {
        if (!timeStr || timeStr.length !== 14) {
            return timeStr || 'N/A';
        }

        const year = timeStr.substring(0, 4);
        const month = timeStr.substring(4, 6);
        const day = timeStr.substring(6, 8);
        const hour = timeStr.substring(8, 10);
        const minute = timeStr.substring(10, 12);
        const second = timeStr.substring(12, 14);

        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
    }, []);

    const calculateSellerReceive = useCallback((amount: number): number => {
        return toNumber(amount) * 0.85;
    }, []);

    return {
        formatPaymentTime,
        calculateSellerReceive
    };
};
