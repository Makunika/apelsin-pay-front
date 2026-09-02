import { getSession, isLoggedIn } from "../utils/tokenStorage";

const session = getSession();

export const initialState = {
    user: session ? session.user : '',
    accessToken: session ? session.accessToken : '',
    isLoggedIn: isLoggedIn(),
    loading: false,
    errorMessage: null,
};

export const AuthReducer = (initialState, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...initialState,
                user: action.payload.user,
                accessToken: action.payload.accessToken,
                isLoggedIn: true,
                loading: false,
            };
        case 'LOGOUT':
            return {
                ...initialState,
                user: '',
                accessToken: '',
                isLoggedIn: false,
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}
