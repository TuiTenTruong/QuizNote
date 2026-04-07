import type { ReactElement } from "react";
import { useAllSubjects, useMyQuizzes } from "../../hooks/useQuiz";
import StudentExploreSection from "../../sections/student/StudentExploreSection";
import useRequireAuth from "../../hooks/useRequireAuth";

export const StudentExplorePage = (): ReactElement => {
    const { subjects, isLoading } = useAllSubjects();
    const { account } = useRequireAuth();

    const userId = Number(account?.id);
    const safeUserId = Number.isFinite(userId) && userId > 0 ? userId : undefined;
    const { myQuizzes, isLoading: isMyQuizzesLoading } = useMyQuizzes(safeUserId);

    const loading = isLoading || isMyQuizzesLoading;
    return <StudentExploreSection subjectsData={subjects} myQuizzes={myQuizzes} isLoading={loading} />;
};

export default StudentExplorePage;