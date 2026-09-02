// Хранилище сессии SPA. Auth-сервер (Spring Authorization Server) не выдаёт refresh_token
// public-клиентам, поэтому храним только access token; по истечении — новый вход через PKCE.
const STORAGE_KEY = "currentUser";
const EXPIRATION_SKEW_SECONDS = 10;

export const parseJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join("")
  );
  return JSON.parse(jsonPayload);
};

export function isTokenExpired(token) {
  try {
    const { exp } = parseJwt(token);
    return Date.now() >= (exp - EXPIRATION_SKEW_SECONDS) * 1000;
  } catch (e) {
    return true;
  }
}

export function getSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveSession(accessToken) {
  const session = { accessToken, user: parseJwt(accessToken) };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAccessToken() {
  const session = getSession();
  return session ? session.accessToken : null;
}

export function isLoggedIn() {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
}
