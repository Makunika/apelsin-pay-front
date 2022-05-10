import axios from "axios";
import {applyAuthTokenInterceptor, clearAuthTokens} from "axios-jwt";
import {logout} from "../context";

// https://www.npmjs.com/package/axios-jwt

const BASE_URL = "http://pshiblo.xyz/"
const URL_AUTH = "auth-service/"
const URL_TRANSACTION = "transaction-service/"
const URL_INFO_BUSINESS = "info-business-service/"
const URL_INFO_PERSONAL = "info-personal-service/"
const URL_ACCOUNT_PERSONAL = "account-personal-service/"
const URL_ACCOUNT_BUSINESS = "account-business-service/"
const URL_PAYMENTS = "payment-service/"
const URL_USERS = "users-service/"

const api = axios.create({
    baseURL: BASE_URL,
    responseType: "json"
})

const requestRefresh = async (refresh) => {
    try {
        const response = await axios.post(`${BASE_URL}${URL_AUTH}oauth/token/refresh_token`,
            {refresh}
        );
        return {
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token
        }
    } catch (e) {
        console.log(e.toJSON())
        localStorage.removeItem('currentUser');
        clearAuthTokens()
    }
    return {}
}


applyAuthTokenInterceptor(api, {
    requestRefresh,
    header: "Authorization",
    headerPrefix: "Bearer "
});

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
            .join('')
    );
    return JSON.parse(jsonPayload);
};

export default api;
export {BASE_URL, URL_PAYMENTS, URL_TRANSACTION, URL_AUTH, URL_USERS, URL_INFO_BUSINESS, URL_INFO_PERSONAL, URL_ACCOUNT_PERSONAL, URL_ACCOUNT_BUSINESS, parseJwt};

