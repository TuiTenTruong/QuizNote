import { useQuery } from "@tanstack/react-query";
import { getSubmissionHistory } from "../api/submission.api";
import { ISubmission } from "../types";

export const submissionHistoryQueryKey = (userId: number) => ["submissionHistory", userId] as const;

export const useHistory = (userId: number) => {
    const { data, isLoading } = useQuery<ISubmission[]>({
        queryKey: submissionHistoryQueryKey(userId),
        enabled: userId > 0,
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const response = await getSubmissionHistory(userId);
            return response.data || [];
        }
    });

    return { historyData: data ?? [], isLoading };
};