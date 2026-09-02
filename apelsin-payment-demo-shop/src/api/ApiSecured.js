import axios from "axios";

import {API_BASE_URL, COMPANY_API_KEY} from "../config";

// https://www.npmjs.com/package/axios-jwt

export const BASE_URL = `${API_BASE_URL}payment-service/`

const API_SECURED = axios.create({
    baseURL: BASE_URL,
    responseType: "json"
})

API_SECURED.interceptors.request.use((config) => {
    config.headers.Authorization = COMPANY_API_KEY;
    return config;
});

export default API_SECURED;
