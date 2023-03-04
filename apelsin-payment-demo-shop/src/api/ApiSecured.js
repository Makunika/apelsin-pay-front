import axios from "axios";

// https://www.npmjs.com/package/axios-jwt

export const BASE_URL = "http://api.graduate.pshiblo.xyz/payment-service/"

const API_SECURED = axios.create({
    baseURL: BASE_URL,
    responseType: "json"
})

API_SECURED.interceptors.request.use((config) => {
    config.headers.Authorization = 'lLADnJEtcHzWb4r8h2Nx';
    return config;
});

export default API_SECURED;

