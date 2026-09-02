import axios from "axios";
import { API_BASE_URL } from "../config";
import { clearSession, getAccessToken, isTokenExpired, parseJwt } from "../utils/tokenStorage";
import { redirectToLogin } from "./AuthApi";

const BASE_URL = API_BASE_URL;
const URL_AUTH = "auth-service/"
const URL_TRANSACTION = "transaction-service/"
const URL_INFO_BUSINESS = "info-business-service/"
const URL_INFO_PERSONAL = "info-personal-service/"
const URL_ACCOUNT_PERSONAL = "account-personal-service/"
const URL_ACCOUNT_BUSINESS = "account-business-service/"
const URL_PAYMENTS = "payment-service/"
const URL_USERS = "users-service/"

const API_SECURED = axios.create({
    baseURL: BASE_URL,
    responseType: "json"
})

// Bearer из localStorage; refresh-токена у public-клиента нет — по истечении access token
// или на 401 сбрасываем сессию и уводим на вход (PKCE). Запросы без токена (public/**) проходят как есть.
API_SECURED.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (!token) {
        return config
    }
    if (isTokenExpired(token)) {
        clearSession()
        redirectToLogin()
        return Promise.reject(new axios.Cancel("Сессия истекла, выполняется повторный вход"))
    }
    config.headers.Authorization = `Bearer ${token}`
    return config
});

API_SECURED.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && getAccessToken()) {
            clearSession()
            redirectToLogin()
        }
        return Promise.reject(error)
    }
);

export default API_SECURED;
export {BASE_URL, URL_PAYMENTS, URL_TRANSACTION, URL_AUTH, URL_USERS, URL_INFO_BUSINESS, URL_INFO_PERSONAL, URL_ACCOUNT_PERSONAL, URL_ACCOUNT_BUSINESS, parseJwt};
