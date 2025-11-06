import axiosInstance from "./axiosCustomize";

const backendBaseURL = axiosInstance.defaults.baseURL + "storage/subjects/";

export const navigateToSelectMode = (navigate, subject) => {
    navigate(`/student/quizzes/${subject.id}/mode-select`, {
        state: {
            quiz: {
                id: subject.id,
                name: subject.name,
                imageUrl: subject.imageUrl,
                author: subject.createUser?.username,
                averageRating: subject.averageRating,
                questionCount: subject.questionCount,
            }
        }
    });
};
