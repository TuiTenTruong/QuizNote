import { ReactElement } from "react";
import { useHistory } from "../../hooks/useHistory";
import useRequireAuth from "../../hooks/useRequireAuth";
import { StudentHistorySection } from "../../sections/student/StudentHistorySection";

export const StudentHistoryPage = (): ReactElement => {
    const { account } = useRequireAuth({
        fromPath: "/student/my-quizzes",
        message: "Vui lòng đăng nhập để xem quiz của bạn.",
    });
    const userId = Number(account?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : 0;

    const { historyData, isLoading } = useHistory(safeUserId);

    return <StudentHistorySection historyData={historyData} loading={isLoading} />;
};