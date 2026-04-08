import type { ReactElement } from "react";
import { StudentHistoryDetailSection } from "../../sections/student/StudentHistoryDetailSection";
import { useHistoryDetail } from "../../hooks/useHistoryDetail";

export const StudentHistoryDetailPage = (): ReactElement => {

    const { isLoading, questionData } = useHistoryDetail();
    return <StudentHistoryDetailSection isLoading={isLoading} questionData={questionData} />;
};

export default StudentHistoryDetailPage;
