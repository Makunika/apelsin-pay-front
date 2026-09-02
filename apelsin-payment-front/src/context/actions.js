import { clearSession, saveSession } from "../utils/tokenStorage";

export async function loginUser(dispatch, token) {
    const currentUser = saveSession(token)
    dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
}

export function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    clearSession()
}
