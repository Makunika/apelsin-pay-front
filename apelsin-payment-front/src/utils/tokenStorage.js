// Сессия платёжной страницы: access token в localStorage.token (+ разобранный пользователь в currentUser).
// Refresh-токена у public-клиента нет — по истечении токена уходим на новый вход через PKCE,
// не очищая весь localStorage.
const TOKEN_KEY = "token";
const USER_KEY = "currentUser";
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

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getSession() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function saveSession(accessToken) {
  const session = { accessToken, user: parseJwt(accessToken) };
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  const token = getAccessToken();
  return !!token && !isTokenExpired(token);
}
