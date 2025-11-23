import { FETCH_USER_SUCCESS, UPDATE_COINS } from '../action/userAction';
const INITIAL_STATE = {
    account: {
        id: '',
        access_token: '',
        refresh_token: '',
        username: '',
        role: '',
        image: '',
        coins: ''
    },
    isauthenticated: false,
};
const userReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS:
            return {
                ...state, account: {
                    id: action.payload.user.id,
                    access_token: action.payload.access_token,
                    refresh_token: action.payload.refreshToken,
                    username: action.payload.user.name,
                    role: action.payload.user.role,
                    image: action.payload.user.avatarUrl,
                    coins: action.payload.user.coins,
                }, isauthenticated: true,
            };
        case 'LOGOUT':
            return {
                ...state, account: {
                    access_token: '',
                    refresh_token: '',
                    username: '',
                    role: '',
                    image: '',
                    coins: '',
                }, isauthenticated: false,
            };
        case UPDATE_COINS:
            return {
                ...state,
                account: {
                    ...state.account,
                    coins: action.payload,
                },
            };
        default: return state;
    }
};

export default userReducer;