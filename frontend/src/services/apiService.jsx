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
const getQuizReviews = async (subjectId, page, size) => {
    return Axios.get(`/api/v1/comments/subject/${subjectId}?page=${page}&size=${size}`);
}
export { postCreateNewUser, postLogin, postLogout, getExploreData, getAllSubjects, getQuizDetail, getQuizDemo, getQuizReviews };
