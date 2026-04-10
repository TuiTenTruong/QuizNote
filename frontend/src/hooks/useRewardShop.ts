import { useCallback, useEffect, useState } from "react";
import { getAvailableRewards } from "../api/reward.api";
import type { IReward } from "../types/reward";

export const useRewardShopQuery = () => {
    const [rewards, setRewards] = useState<IReward[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchRewards = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getAvailableRewards();
            setRewards(response.data || []);
        } catch (error) {
            console.error("Error fetching rewards:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchRewards();
    }, [fetchRewards]);

    return {
        rewards,
        loading,
        fetchRewards,
    };
};
