import Axios from '../utils/axiosCustomize';
const postCreateNewUser = async (email, password, username, gender, role = 'STUDENT', bankName = null, bankAccount = null) => {
    const data = {
        email: email,
        password: password,
        name: username,
        gender: gender,
        role: role,
        bankName: bankName,
        bankAccount: bankAccount
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
    return Axios.get(`/api/v1/subjects/demo`);
}
const getAllActiveSubjects = async () => {
    return Axios.get(`/api/v1/subjects?filter=status='ACTIVE'`);
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
const createQuestionBatch = async (formData) => {
    return Axios.post('/api/v1/questions/batch', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const saveDraftQuiz = async (quizData) => {
    return Axios.post('/api/v1/subjects/draft', quizData);
}
const getSubjectBySellerId = async (sellerId, spec, page) => {
    return Axios.get(`/api/v1/subjects/seller/${sellerId}?spec=${spec}&page=${page}`);
}
const getOrderOfSeller = async (sellerId, page, size) => {
    return Axios.get(`/api/v1/seller/orders/${sellerId}?page=${page}&size=${size}`);
}
const getWalletofSeller = async (sellerId) => {
    return Axios.get(`/api/v1/seller/getWallet/${sellerId}`);
}
const withdrawFromSellerWallet = async (sellerId, amount) => {
    const data = {
        sellerId: sellerId,
        amount: amount
    };
    return Axios.post(`/api/v1/withdraw`, data);
}

// Settings API
const getCurrentUser = async () => {
    return Axios.get('/api/v1/users/me');
}

const updateUserProfile = async (profileData) => {
    return Axios.put('/api/v1/users/profile', profileData);
}

const changePassword = async (currentPassword, newPassword) => {
    const data = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };
    return Axios.post('/api/v1/users/change-password', data);
}

const updateUserPreferences = async (preferences) => {
    return Axios.put('/api/v1/users/preferences', preferences);
}

const uploadAvatar = async (email, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return Axios.post(`/api/v1/users/${email}/avatar`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

const deleteUserAccount = async (userId) => {
    return Axios.delete(`/api/v1/users/${userId}`);
}

const AdminAnalytics = async () => {
    return Axios.get(`/api/v1/admin/analysis`);
}

const GetAllUsers = async (page) => {
    return Axios.get(`/api/v1/users?page=${page}&size=10`);
}

const UpdateUser = async (userId, data) => {
    return Axios.put(`/api/v1/users`, data);
}

const CreateUser = async (data) => {
    return Axios.post(`/api/v1/users`, data);
}

const DeleteUser = async (userId) => {
    return Axios.delete(`/api/v1/users/${userId}`);
}

const getAllRoles = async () => {
    return Axios.get(`/api/v1/roles`);
}

const changeStatusUser = async (id, status) => {
    const data = {
        id: id,
        status: status
    };
    return Axios.post(`/api/v1/users/changeStatus`, data);
}

// Roles API
const createRole = async (roleData) => {
    return Axios.post('/api/v1/roles', roleData);
}

const updateRole = async (roleData) => {
    return Axios.put('/api/v1/roles', roleData);
}

const deleteRole = async (roleId) => {
    return Axios.delete(`/api/v1/roles/${roleId}`);
}

const getRolesPaginated = async (page = 0, size = 10) => {
    return Axios.get(`/api/v1/roles?page=${page}&size=${size}`);
}

// Permissions API
const getAllPermissions = async (page = 0, size = 100) => {
    return Axios.get(`/api/v1/permissions?page=${page}&size=${size}`);
}

const createPermission = async (permissionData) => {
    return Axios.post('/api/v1/permissions', permissionData);
}

const updatePermission = async (permissionData) => {
    return Axios.put('/api/v1/permissions', permissionData);
}

const deletePermission = async (permissionId) => {
    return Axios.delete(`/api/v1/permissions/${permissionId}`);
}

const getAllSubjects = async () => {
    return Axios.get(`/api/v1/subjects`);
}

const approveSubject = async (subjectId) => {
    return Axios.put(`/api/v1/subjects/${subjectId}/approve`);
}

const rejectSubject = async (subjectId) => {
    return Axios.put(`/api/v1/subjects/${subjectId}/reject`);
}

const updateSubject = async (formData) => {
    return Axios.put(`/api/v1/subjects`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const deleteQuestion = async (questionId) => {
    return Axios.delete(`/api/v1/questions/${questionId}`);
}

const createQuestionsBatch = async (questions) => {
    return Axios.post('/api/v1/questions/batch', questions);
}

const updateQuestion = async (questionData) => {
    return Axios.put('/api/v1/questions', questionData);
}

const deleteSubject = async (subjectId) => {
    return Axios.delete(`/api/v1/subjects/${subjectId}`);
}

const getAllAdminOrders = async () => {
    return Axios.get(`/api/v1/admin/orders`);
}

const sellerGetRecentOrders = async (subjectId) => {
    return Axios.get(`/api/v1/seller/recentOrder/${subjectId}`);
}

const createComment = async (subjectId, content, rating) => {
    const data = {
        content: content,
        rating: rating
    };
    return Axios.post(`/api/v1/comments/${subjectId}`, data);
}

const getMyRatings = async (userId, subjectId) => {
    return Axios.get(`/api/v1/comments/user/${userId}/${subjectId}`);
}

const replyComment = async (parentCommentId, content) => {
    const data = {
        content: content
    };
    return Axios.post(`/api/v1/comments/reply/${parentCommentId}`, data);
}
const getCurrentWeeklyQuiz = async () => {
    return Axios.get("/api/v1/weekly-quiz/current");
}
const getUserStatusInWeeklyQuiz = async (quizId) => {
    return Axios.get(`/api/v1/weekly-quiz/${quizId}/status`);
}
const submitWeeklyQuiz = async (submitData) => {
    return Axios.post("/api/v1/weekly-quiz/submit", submitData);
}
const getAllWeeklyQuizzes = async () => {
    return Axios.get("/api/v1/admin/weekly-quizzes");
}
const getWeeklyQuizQuestions = async (quizId) => {
    return Axios.get(`/api/v1/admin/weekly-quizzes/${quizId}`);
}
const createWeeklyQuiz = async (quizData) => {
    return Axios.post("/api/v1/admin/weekly-quizzes", quizData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const updateWeeklyQuiz = async (quizId, quizData) => {
    return Axios.put(`/api/v1/admin/weekly-quizzes/${quizId}`, quizData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}
const deletedWeeklyQuiz = async (quizId) => {
    return Axios.delete(`/api/v1/admin/weekly-quizzes/${quizId}`);
}
export {
    postCreateNewUser, postLogin, postLogout, getExploreData,
    getAllActiveSubjects, getQuizDetail, getQuizDemo, getQuizQuestions,
    getQuizReviews, fetchMyQuizzes, startSubmission, submitQuizResult, getQuizRandom, getHistoryUser,
    getStudentAnalytics, getSellerAnalytics, VNPayCreateOrder, createQuiz,
    createQuestion, saveDraftQuiz, getSubjectBySellerId, getOrderOfSeller, getWalletofSeller, withdrawFromSellerWallet,
    getCurrentUser, updateUserProfile, changePassword, updateUserPreferences, uploadAvatar, deleteUserAccount,
    AdminAnalytics, GetAllUsers, UpdateUser, CreateUser, DeleteUser, getAllRoles, changeStatusUser,
    createRole, updateRole, deleteRole, getRolesPaginated, getAllPermissions, createPermission, updatePermission, deletePermission, getAllSubjects,
    approveSubject, rejectSubject, deleteSubject, updateSubject, deleteQuestion, createQuestionsBatch, updateQuestion, getAllAdminOrders, sellerGetRecentOrders,
    createComment, getMyRatings, replyComment, createQuestionBatch, getCurrentWeeklyQuiz
    , getUserStatusInWeeklyQuiz, submitWeeklyQuiz, getAllWeeklyQuizzes, createWeeklyQuiz, updateWeeklyQuiz, deletedWeeklyQuiz, getWeeklyQuizQuestions
};
