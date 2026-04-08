import { ReactElement, useState } from "react";
import { AnalyticsTimeRange, useStudentAnalytic } from "../../hooks/useAnalytic";
import { useSelector } from "react-redux";
import { StudentAnalyticSection } from "../../sections/student/StudentAnalyticSection";

interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}
export const StudentAnalyticPage = (): ReactElement => {
    const account = useSelector((state: RootState) => state.user?.account);
    const [timeRange, setTimeRange] = useState<AnalyticsTimeRange>("7");

    const userId = Number(account?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : 0;
    const { analytics, loading, error } = useStudentAnalytic(safeUserId, timeRange);

    return (
        <StudentAnalyticSection
            analytics={analytics}
            loading={loading}
            error={error}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
        />
    );
}