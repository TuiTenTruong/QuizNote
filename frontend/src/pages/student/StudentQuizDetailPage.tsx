import { useEffect, useState } from "react";
import type { FormEvent, ReactElement } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentQuizDetailSection from "../../sections/student/StudentQuizDetailSection";
import { useComment } from "../../hooks/useComment";
import { useGetQuizDetail, useQuizDemo } from "../../hooks/useQuiz";
import { useReting } from "../../hooks/useRating";

type AlertVariant = "success" | "danger";

interface SubmitMessage {
    type: AlertVariant;
    text: string;
}

interface RootState {
    user?: {
        account?: {
            id?: number;
        } | null;
    };
}

interface QuizDetailLocationState {
    hasPurchased?: boolean;
}

const REVIEW_PAGE_SIZE = 5;

export const StudentQuizDetailPage = (): ReactElement => {
    const [reviewContent, setReviewContent] = useState<string>("");
    const [submitMessage, setSubmitMessage] = useState<SubmitMessage | null>(null);

    const { quizId } = useParams<{ quizId: string }>();
    const quizIdNumber = Number(quizId);
    const location = useLocation();
    const navigate = useNavigate();

    const account = useSelector((state: RootState) => state.user?.account);
    const isAuthenticated = Boolean(account?.id);
    const hasPurchased = Boolean((location.state as QuizDetailLocationState | undefined)?.hasPurchased);

    const { rating, setRating, isRated: isRating, resetRating } = useReting(account?.id, quizIdNumber, isAuthenticated);
    const { quizDetail: quizData } = useGetQuizDetail(quizIdNumber);
    const { quizDemo } = useQuizDemo(quizIdNumber, 0, 5);
    const {
        reviews,
        reviewsPage,
        maxReviews,
        countReviews,
        hasMoreReviews,
        reviewsLoading,
        submitLoading,
        fetchReviews,
        submitReview,
    } = useComment(quizIdNumber, REVIEW_PAGE_SIZE);

    useEffect(() => {
        if (!quizIdNumber || Number.isNaN(quizIdNumber)) {
            navigate("/");
            return;
        }
    }, [navigate, quizIdNumber]);

    const handleLoadMoreReviews = () => {
        fetchReviews(reviewsPage + 1);
    };

    const handleSubmitReview = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!quizIdNumber) return;

        if (isRating) {
            setSubmitMessage({ type: "danger", text: "Bạn đã đánh giá quiz này rồi." });
            return;
        }

        if (!reviewContent.trim()) {
            setSubmitMessage({ type: "danger", text: "Vui lòng nhập nội dung đánh giá!" });
            return;
        }

        setSubmitMessage(null);

        try {
            const isSuccess = await submitReview({
                content: reviewContent,
                rating,
                subjectName: quizData?.name ?? "",
            });

            if (isSuccess) {
                setSubmitMessage({ type: "success", text: "Đánh giá của bạn đã được gửi thành công!" });
                setReviewContent("");
                resetRating();
                return;
            }

            setSubmitMessage({ type: "danger", text: "Có lỗi xảy ra. Vui lòng thử lại!" });
        } catch (error) {
            console.error("Error submitting review:", error);
            setSubmitMessage({ type: "danger", text: "Có lỗi xảy ra. Vui lòng thử lại!" });
        }
    };

    return (
        <StudentQuizDetailSection
            quizData={quizData}
            quizDemo={quizDemo}
            reviews={reviews}
            reviewsPage={reviewsPage}
            maxReviews={maxReviews}
            countReviews={countReviews}
            hasMoreReviews={hasMoreReviews}
            reviewsLoading={reviewsLoading}
            submitLoading={submitLoading}
            hasPurchased={hasPurchased}
            isAuthenticated={isAuthenticated}
            isRating={isRating}
            rating={rating}
            reviewContent={reviewContent}
            submitMessage={submitMessage}
            onLoadMoreReviews={handleLoadMoreReviews}
            onSubmitReview={handleSubmitReview}
            onRatingChange={setRating}
            onReviewContentChange={setReviewContent}
        />
    );
};

export default StudentQuizDetailPage;
