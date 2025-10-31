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
export { postCreateNewUser, postLogin, postLogout };
