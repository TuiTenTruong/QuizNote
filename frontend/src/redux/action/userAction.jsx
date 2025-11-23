export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const UPDATE_COINS = 'UPDATE_COINS';

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

export const updateCoins = (coins) => {
    return {
        type: UPDATE_COINS,
        payload: coins,
    };
}