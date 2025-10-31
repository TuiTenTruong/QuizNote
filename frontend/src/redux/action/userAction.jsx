export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';

export const doLogin = (userData) => {
    return {
        type: FETCH_USER_SUCCESS,
        payload: userData,
    };
}

export const doLogout = () => {
    return {
        type: 'LOGOUT',
    };
}