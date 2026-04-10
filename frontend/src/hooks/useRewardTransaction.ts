import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllRewardTransactions, updateTransactionStatus } from '../api/reward.api';
import axiosInstance from '../utils/axiosCustomize';
import type { IRewardTransaction, RewardTransactionStatus } from '../types/reward';

export type RewardTransactionFilterStatus = 'All' | 'COMPLETED' | 'PENDING' | 'CANCELLED';

export interface DeliveryInfo {
    name: string;
    phone: string;
    address: string;
}

const DEFAULT_PAGE_SIZE = 10;

export const parseRewardDeliveryInfo = (deliveryInfo?: string): DeliveryInfo => {
    if (!deliveryInfo) {
        return { name: '-', phone: '-', address: '-' };
    }

    const namePart = deliveryInfo.match(/Name:\s*([^,]+)/);
    const phonePart = deliveryInfo.match(/Phone:\s*([^,]+)/);
    const addressPart = deliveryInfo.match(/Address:\s*(.+)/);

    return {
        name: namePart ? namePart[1].trim() : '-',
        phone: phonePart ? phonePart[1].trim() : '-',
        address: addressPart ? addressPart[1].trim() : '-'
    };
};

export const formatRewardTransactionDate = (dateString?: string): string => {
    if (!dateString) {
        return '-';
    }

    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const useRewardTransactionQuery = (pageSize: number = DEFAULT_PAGE_SIZE) => {
    const [transactions, setTransactions] = useState<IRewardTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);

    const backendBaseURL = `${axiosInstance.defaults.baseURL}storage/rewards/`;

    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAllRewardTransactions(currentPage, pageSize);
            if (response && response.data) {
                setTransactions(response.data.result || []);
                setTotalPages(response.data.meta.pages || 0);
                setTotalElements(response.data.meta.total || 0);
            }
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            toast.error('Khong the tai danh sach giao dich');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    return {
        transactions,
        loading,
        currentPage,
        totalPages,
        totalElements,
        backendBaseURL,
        fetchTransactions,
        setCurrentPage,
        handlePageChange
    };
};

export const useRewardTransactionFilter = (transactions: IRewardTransaction[]) => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<RewardTransactionFilterStatus>('All');

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const userName = transaction.user?.name || transaction.userName || '';
            const userEmail = transaction.user?.email || transaction.userEmail || '';
            const rewardName = transaction.reward?.name || '';

            const matchSearch =
                userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rewardName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchStatus = filterStatus === 'All' || transaction.status === filterStatus;

            return matchSearch && matchStatus;
        });
    }, [transactions, searchTerm, filterStatus]);

    return {
        searchTerm,
        setSearchTerm,
        filterStatus,
        setFilterStatus,
        filteredTransactions
    };
};

export const useRewardTransactionDetailActions = (fetchTransactions: () => Promise<void>) => {
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    const [selectedTransaction, setSelectedTransaction] = useState<IRewardTransaction | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

    const handleShowDetail = useCallback((transaction: IRewardTransaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setShowDetailModal(false);
        setSelectedTransaction(null);
    }, []);

    const handleUpdateStatus = useCallback(
        async (newStatus: RewardTransactionStatus) => {
            if (!selectedTransaction) {
                return;
            }

            setUpdatingStatus(true);
            try {
                const response = await updateTransactionStatus(selectedTransaction.id, newStatus);
                if (response) {
                    toast.success('Cap nhat trang thai thanh cong');
                    await fetchTransactions();
                    handleCloseDetail();
                }
            } catch (error) {
                console.error('Error updating status:', error);
                toast.error('Khong the cap nhat trang thai');
            } finally {
                setUpdatingStatus(false);
            }
        },
        [fetchTransactions, handleCloseDetail, selectedTransaction]
    );

    return {
        showDetailModal,
        selectedTransaction,
        updatingStatus,
        handleShowDetail,
        handleCloseDetail,
        handleUpdateStatus
    };
};
