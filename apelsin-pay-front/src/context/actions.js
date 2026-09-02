import { exchangeCodeForToken } from "../api/AuthApi";
import { clearSession, isLoggedIn, saveSession } from "../utils/tokenStorage";

export async function loginUser(dispatch, { code, state }) {
    const data = await exchangeCodeForToken(code, state)
    const currentUser = saveSession(data.access_token)
    dispatch({ type: 'LOGIN_SUCCESS', payload: currentUser });
    return currentUser.user
}

export async function logout(dispatch) {
    dispatch({ type: 'LOGOUT' });
    clearSession()
}

export function checkAuth() {
    console.log(`auth - ${isLoggedIn()}`)
}
