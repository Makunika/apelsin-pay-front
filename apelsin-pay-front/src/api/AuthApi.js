import axios from "axios";
import { AUTH_BASE_URL, LOGIN_REDIRECT_URI, OAUTH_CLIENT_ID, OAUTH_SCOPE } from "../config";
import { createPkce, randomUrlSafeString, savePkce, takePkce } from "../utils/pkce";

// OAuth2 authorization_code + PKCE (S256), public-клиент browser_main без секрета.
export const BASE_AUTH_URL = AUTH_BASE_URL;
export const AUTHORIZE_URL = `${AUTH_BASE_URL}/oauth2/authorize`;
export const TOKEN_URL = `${AUTH_BASE_URL}/oauth2/token`;

export async function buildAuthorizationUrl() {
  const { codeVerifier, codeChallenge } = await createPkce();
  const state = randomUrlSafeString(16);
  savePkce({ codeVerifier, state });
  const params = new URLSearchParams({
    client_id: OAUTH_CLIENT_ID,
    redirect_uri: LOGIN_REDIRECT_URI,
    scope: OAUTH_SCOPE,
    response_type: "code",
    state,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });
  return `${AUTHORIZE_URL}?${params.toString()}`;
}

let redirectInProgress = null;

// Один переход на страницу логина, даже если позвали из нескольких guard'ов одновременно
export function redirectToLogin() {
  if (!redirectInProgress) {
    redirectInProgress = buildAuthorizationUrl().then((url) => {
      window.location.assign(url);
    });
  }
  return redirectInProgress;
}

export async function exchangeCodeForToken(code, state) {
  const pkce = takePkce();
  if (!pkce || !pkce.codeVerifier) {
    throw new Error("Сессия входа не найдена, начните вход заново");
  }
  if (pkce.state !== state) {
    throw new Error("Некорректный параметр state");
  }
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: LOGIN_REDIRECT_URI,
    client_id: OAUTH_CLIENT_ID,
    code_verifier: pkce.codeVerifier,
  }).toString();
  const { data } = await axios.post(TOKEN_URL, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}
