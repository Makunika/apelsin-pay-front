// Адреса бэкенда. Переопределяются на этапе сборки CRA через переменные REACT_APP_* (см. .env.example),
// по умолчанию — продовые значения.
export const API_BASE_URL = process.env.REACT_APP_API_URL || "http://api.graduate.pshiblo.xyz/";
export const AUTH_BASE_URL = process.env.REACT_APP_AUTH_URL || "http://login.graduate.pshiblo.xyz";
export const LOGIN_REDIRECT_URI = process.env.REACT_APP_LOGIN_REDIRECT_URI || "http://graduate.pshiblo.xyz/login";

export const OAUTH_CLIENT_ID = "browser_main";
export const OAUTH_SCOPE = "user";
