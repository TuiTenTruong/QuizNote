import { useEffect, useState } from "react";
import { IStudentAnalytics } from "../types";
import { getStudentAnalytics } from "../api/analytics.api";

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