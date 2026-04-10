import { useCallback, useEffect, useMemo, useState } from "react";
import { createVNPayOrder } from "../api/payment.api";
import { getSubjectDetail } from "../api/subject.api";
import type { IPaymentResultViewData } from "../types/payment";
import type { ISubject } from "../types/subject";

interface QuizPaymentLocationState {
    quiz?: ISubject;
}

export const useQuizPaymentSubjectQuery = (quizId: number, state: unknown) => {
    const [quizData, setQuizData] = useState<ISubject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const preloadedQuiz = useMemo(() => {
        const payload = (state ?? {}) as QuizPaymentLocationState;
        return payload.quiz ?? null;
    }, [state]);

    const fetchSubjectDetail = useCallback(async () => {
        if (preloadedQuiz) {
            setQuizData(preloadedQuiz);
            setLoading(false);
            return;
        }

        if (!quizId) {
            setError("ID mon hoc khong hop le.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const response = await getSubjectDetail(quizId);
            setQuizData(response.data ?? null);
        } catch (fetchError) {
            console.error("Error fetching subject detail:", fetchError);
            setError("Khong the tai thong tin mon hoc. Vui long thu lai sau.");
        } finally {
            setLoading(false);
        }
    }, [preloadedQuiz, quizId]);

    useEffect(() => {
        void fetchSubjectDetail();
    }, [fetchSubjectDetail]);

    return {
        quizData,
        loading,
        error,
    };
};

export const useCreateVNPayOrderMutation = () => {
    const [loading, setLoading] = useState(false);

    const createOrderUrl = useCallback(async (amount: number, orderInfo: string): Promise<string | null> => {
        try {
            setLoading(true);
            const response = await createVNPayOrder(amount, orderInfo);
            const paymentUrl = response?.data ?? null;
            console.log("VNPay order created, payment URL:", paymentUrl);

            if (!paymentUrl || !paymentUrl.includes("http")) {
                return null;
            }


            return paymentUrl;
        } catch (createError) {
            console.error("Error creating VNPay order:", createError);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        createOrderUrl,
    };
};

export const usePaymentResultState = (searchParams: URLSearchParams) => {
    return useMemo<IPaymentResultViewData>(() => {
        const status = searchParams.get("status") === "success";
        const orderInfo = searchParams.get("orderInfo") ?? "";
        const transactionNo = searchParams.get("transactionNo") ?? "";
        const amount = Number(searchParams.get("amount") ?? 0);
        const paymentTime = searchParams.get("paymentTime") ?? "";
        const responseCode = searchParams.get("responseCode") ?? "";

        return {
            status,
            orderInfo,
            transactionNo,
            amount: Number.isNaN(amount) ? 0 : amount,
            paymentTime,
            responseCode,
        };
    }, [searchParams]);
};

export const formatVNPayPaymentTime = (timeStr: string): string => {
    if (!timeStr || timeStr.length !== 14) {
        return timeStr;
    }

    const year = timeStr.substring(0, 4);
    const month = timeStr.substring(4, 6);
    const day = timeStr.substring(6, 8);
    const hour = timeStr.substring(8, 10);
    const minute = timeStr.substring(10, 12);
    const second = timeStr.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export const extractSubjectIdFromOrderInfo = (orderInfo: string): number | null => {
    const subjectMatch = orderInfo.match(/subject:(\d+)/);
    const subjectId = Number(subjectMatch?.[1] ?? 0);
    return Number.isFinite(subjectId) && subjectId > 0 ? subjectId : null;
};
