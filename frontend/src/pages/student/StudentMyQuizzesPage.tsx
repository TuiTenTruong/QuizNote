import type { ReactElement } from "react";
import StudentMyQuizzesSection from "../../sections/student/StudentMyQuizzesSection";
import { useMyQuizzes } from "../../hooks/useQuiz";
import useRequireAuth from "../../hooks/useRequireAuth";

export const StudentMyQuizzesPage = (): ReactElement => {
    const { account, isAuthenticated } = useRequireAuth({
        fromPath: "/student/my-quizzes",
        message: "Vui lòng đăng nhập để xem quiz của bạn.",
    });
    const userId = Number(account?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : undefined;

    const { myQuizzes, isLoading } = useMyQuizzes(safeUserId);

    return <StudentMyQuizzesSection myQuizzes={myQuizzes} isLoading={isLoading} isAuthenticated={isAuthenticated} />;
};

export default StudentMyQuizzesPage;