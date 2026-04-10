import { useEffect, useState } from "react";
import { IAdminAnalytics, IStudentAnalytics } from "../types";
import { getAdminAnalytics, getSellerAnalytics, getStudentAnalytics } from "../api/analytics.api";

export type AnalyticsTimeRange = "7" | "30" | "all";

export const useStudentAnalytic = (userId: number, timeRange: AnalyticsTimeRange) => {
    const [analytics, setAnalytics] = useState<IStudentAnalytics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            if (userId <= 0) {
                setAnalytics(null);
                setLoading(false);
                setError(null);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const days: number | null = timeRange === "all" ? null : Number.parseInt(timeRange, 10);
                const response = await getStudentAnalytics(userId, days);
                if (response && response.statusCode === 200) {
                    setAnalytics(response.data);
                } else {
                    setError(response.message || "Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");
                }
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError("Không thể tải dữ liệu phân tích. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, [userId, timeRange]);

    return { analytics, loading, error };
};

export const useAdminAnalytic = () => {
    const [analytics, setAnalytics] = useState<IAdminAnalytics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await getAdminAnalytics();
                if (response && response.statusCode === 200) {
                    setAnalytics(response.data);
                    return;
                }

                setError(response.message || "Không thể tải dữ liệu phân tích quản trị.");
            } catch (err) {
                console.error("Error fetching admin analytics:", err);
                setError("Không thể tải dữ liệu phân tích quản trị.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return { analytics, loading, error };
};

export const useSellerAnalyticsQuery = (sellerId?: number, months?: number | null) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSellerAnalytics = async () => {
        if (!sellerId) {
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await getSellerAnalytics(sellerId, months);
            setData(response.data as any);
        } catch (fetchError) {
            console.error("Error fetching seller analytics:", fetchError);
            setError("Loi khi tai thong ke nguoi ban.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSellerAnalytics();
    }, [sellerId, months]);

    return {
        data,
        loading,
        error,
        refetch: fetchSellerAnalytics,
    };
};