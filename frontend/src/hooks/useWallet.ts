import { useCallback, useEffect, useState } from 'react';
import { getSellerWallet, withdraw } from '../api/wallet.api';
import type { ISellerWallet } from '../types/wallet';

export const useSellerWalletQuery = (sellerId?: number) => {
    const [wallet, setWallet] = useState<ISellerWallet | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellerWallet = useCallback(async () => {
        if (!sellerId) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getSellerWallet(sellerId);
            setWallet(response.data);
        } catch (fetchError) {
            console.error('Error fetching seller wallet:', fetchError);
            setError('Khong the tai vi nguoi ban.');
        } finally {
            setLoading(false);
        }
    }, [sellerId]);

    useEffect(() => {
        fetchSellerWallet();
    }, [fetchSellerWallet]);

    return {
        wallet,
        loading,
        error,
        refetch: fetchSellerWallet,
    };
};

export const useSellerWithdrawMutation = () => {
    const [loading, setLoading] = useState(false);

    const executeWithdraw = useCallback(async (sellerId: number, amount: number) => {
        try {
            setLoading(true);
            return await withdraw({ sellerId, amount });
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        executeWithdraw,
        loading,
    };
};
