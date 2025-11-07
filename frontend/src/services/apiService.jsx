import Axios from '../utils/axiosCustomize';
const postCreateNewUser = async (email, password, username, gender) => {
    const data = {
        email: email,
        password: password,
        name: username,
        gender: gender
    };
    return Axios.post('api/v1/auth/register', data);
}

const postLogin = async (email, password) => {
    const data = {
        username: email,
        password: password
    };
    return Axios.post('api/v1/auth/login', data);
}
const postLogout = async () => {
    return Axios.post('api/v1/auth/logout');
}
const getExploreData = async () => {
    return Axios.get(`/api/v1/subjects?filter=id<=6`);
}
const getAllSubjects = async () => {
    return Axios.get('/api/v1/subjects');
}
const getQuizDetail = async (subjectId) => {
    return Axios.get(`/api/v1/subjects/${subjectId}`);
}
const getQuizDemo = async (subjectId) => {
    return Axios.get(`/api/v1/questions/subject/${subjectId}?page=0&size=5`);
}
const getQuizQuestions = async (subjectId) => {
    return Axios.get(`/api/v1/questions/subject/${subjectId}`);
}
const getQuizReviews = async (subjectId, page, size) => {
    return Axios.get(`/api/v1/comments/subject/${subjectId}?page=${page}&size=${size}`);
}
const getQuizRandom = async (subjectId, numberOfQuestions) => {
    return Axios.get(`/api/v1/questions/subject/${subjectId}/random?size=${numberOfQuestions}`);
}
const fetchMyQuizzes = async (userId) => {
    return Axios.get(`/api/v1/purchases/user/${userId}`);
}
const startSubmission = async (quizId, userId, duration) => {
    const data = {
        userId: userId,
        subjectId: quizId,
        duration: duration
    };
    return Axios.post(`/api/v1/submissions/start`, data);
}
const submitQuizResult = async (submissionId, answers) => {
    return Axios.post(`/api/v1/submissions/${submissionId}/submit`, answers);
};
const getHistoryUser = async (userId) => {
    return Axios.get(`/api/v1/submissions/history/user/${userId}`);
}
const getStudentAnalytics = async (userId, days = null) => {
    const params = days ? `?days=${days}` : '';
    return Axios.get(`/api/v1/submissions/analytics/user/${userId}${params}`);
}
const getSellerAnalytics = async (sellerId, months = null) => {
    const params = months ? `?months=${months}` : '';
    return Axios.get(`/api/v1/seller/analytics/${sellerId}${params}`);
}

const VNPayCreateOrder = async (amount, orderInfo) => {
    return Axios.post(`/api/v1/payments/vnpay/submitOrder?amount=${amount}&orderInfo=${orderInfo}`);
}
const createQuiz = async (formData) => {
    return Axios.post('/api/v1/subjects', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const createQuestion = async (data) => {
    return Axios.post('/api/v1/questions', data);
}
const saveDraftQuiz = async (quizData) => {
    return Axios.post('/api/v1/subjects/draft', quizData);
}
export {
    postCreateNewUser, postLogin, postLogout, getExploreData,
    getAllSubjects, getQuizDetail, getQuizDemo, getQuizQuestions,
    getQuizReviews, fetchMyQuizzes, startSubmission, submitQuizResult, getQuizRandom, getHistoryUser,
    getStudentAnalytics, getSellerAnalytics, VNPayCreateOrder, createQuiz, createQuestion, saveDraftQuiz
};
