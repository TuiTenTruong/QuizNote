import type { ReactElement } from "react";
import { useSelector } from "react-redux";
import { useAllActiveSubjects, useMyQuizzes } from "../../hooks/useQuiz";
import StudentExploreSection from "../../sections/student/StudentExploreSection";

interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}

export const StudentExplorePage = (): ReactElement => {
    const { subjects, isLoading } = useAllActiveSubjects();
    const account = useSelector((state: RootState) => state.user?.account);

    const userId = Number(account?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : undefined;
    const { myQuizzes, isLoading: isMyQuizzesLoading } = useMyQuizzes(safeUserId);

    const loading = isLoading || isMyQuizzesLoading;
    return <StudentExploreSection subjectsData={subjects} myQuizzes={myQuizzes} isLoading={loading} />;
};

export default StudentExplorePage;