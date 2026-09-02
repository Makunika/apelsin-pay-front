# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frontends for "Апельсин Pay" (demo bank / payment gateway; backend in the sibling repo `apelsin-pay`). Three independent Create-React-App projects, all forked from the same "Minimal Free" MUI kit (`package.json` name is still `@minimal/material-kit-react`), plus an nginx balancer. Not a workspace: no root `package.json`, each app is installed and built on its own. UI text is Russian.

| dir | purpose | port | vhost |
|---|---|---|---|
| `apelsin-pay-front` | main bank UI (accounts, companies, moderation, profile) | 3000 | graduate.pshiblo.xyz |
| `apelsin-payment-front` | hosted checkout page merchants redirect to | 3002 | payment.graduate.pshiblo.xyz |
| `apelsin-payment-demo-shop` | demo merchant that creates orders | 3001 | demoshop.graduate.pshiblo.xyz |
| `apelsin-balancer` | nginx, vhost → container routing | 80 | all of the above + `api.` → gateway:8080, `login.` → auth-service:5000 |

## Commands

Run inside one of the app directories:

```bash
npm install
npm start          # CRA dev server
npm run build
npm run lint       # eslint --ext .js,.jsx ./src  (airbnb + prettier); npm run lint:fix
```

`npm test` exists but there are no test files in any app. `npm run lint` reports many pre-existing warnings but must have 0 errors — CRA's `npm run build` fails on lint errors. The `start` script in `apelsin-payment-front` / `apelsin-payment-demo-shop` uses Windows `set PORT=...` syntax, which is a no-op on macOS/Linux — pass `PORT=3006 npm start` yourself when running two apps at once (the auth server's `local` profile whitelists `http://localhost:3000/login` and `http://localhost:3006/login` as redirect URIs).

```bash
docker compose up --build    # builds all four images (node:18-alpine build → nginx:alpine)
```

The balancer proxies to `gateway` and `auth-service` which are defined in the backend repo's compose; the two stacks must share a Docker network for that to work.

## Architecture

### Backend URLs

`apelsin-pay-front` and `apelsin-payment-front` read backend addresses from `src/config.js`: `REACT_APP_API_URL` (gateway, default `http://api.graduate.pshiblo.xyz/`), `REACT_APP_AUTH_URL` (auth-service, default `http://login.graduate.pshiblo.xyz`) and `REACT_APP_LOGIN_REDIRECT_URI` (default `http://graduate.pshiblo.xyz/login` / `http://payment.graduate.pshiblo.xyz/login`). They are CRA build-time variables — copy `.env.example` to `.env.local` for a local backend (`localhost:3000` / `localhost:3006` are whitelisted as redirect URIs in the auth server's `local` profile). Still hardcoded: `apelsin-payment-demo-shop/src/api/ApiSecured.js` and `sections/ProductCard.js` (`redirectUrl`, `companyId: 4`), plus a few cross-app links (`routes.js`, `DemoShopPage.js`).

Backend services are addressed as path prefixes on the single gateway, exported from `ApiSecured.js`: `URL_AUTH`, `URL_TRANSACTION`, `URL_INFO_BUSINESS`, `URL_INFO_PERSONAL`, `URL_ACCOUNT_PERSONAL`, `URL_ACCOUNT_BUSINESS`, `URL_PAYMENT`, `URL_USERS` — e.g. `apiSecured.get(\`${URL_TRANSACTION}api/transaction/...\`)`. Endpoints under `/public/` need no token.

### Auth (OAuth2 authorization_code + PKCE)

The auth server is Spring Authorization Server (`apelsin-pay/auth-service`): `/oauth2/authorize`, `/oauth2/token`, `/oauth2/jwks`. Both user-facing apps are **public clients** (no secret) using authorization_code with PKCE S256; the SPA talks to `/oauth2/token` directly (CORS is whitelisted per origin on the auth server), not through the gateway.

- Shared pieces (copy-pasted into both apps): `src/utils/pkce.js` (code_verifier / S256 challenge / state kept in `sessionStorage` between the redirect and the callback; has a pure-JS SHA-256 fallback because `crypto.subtle` is unavailable on the http origin) and `src/utils/tokenStorage.js` (access token + decoded JWT in `localStorage`, `isTokenExpired`, `isLoggedIn`).
- **No refresh tokens**: Spring Authorization Server 0.4 does not issue them to public clients, so there is no silent refresh. When the access token expires or a request gets 401, `ApiSecured.js` clears the session and calls `redirectToLogin()` (new PKCE round trip). Token TTLs are set per client on the backend (`auth.clients.*.access-token-ttl`).
- **apelsin-pay-front** — client `browser_main`, scope `user`. `api/AuthApi.js`: `redirectToLogin()` (deduplicated, async — guards call it from `useEffect` and render nothing meanwhile), `exchangeCodeForToken(code, state)`. `pages/Login.js` handles `?code=&state=` and `?error=`; `context/actions.js` `loginUser` saves the session. Roles come from the JWT `authorities` claim (`utils/userUtils.js`) and gate routes via `ModeratorGuard` / `AdministratorGuard`.
- **apelsin-payment-front** — client `browser_payment`, scope `user_payment`. Same flow; the order id travels in `state` as `<nonce>.<orderId>` (`orderIdFromState`), `pages/Login.js` then navigates to `/apelsin/?id=<orderId>`. `AuthGuard` / `ApiSecured` redirect back to login with the current order instead of `localStorage.clear()`.
- **apelsin-payment-demo-shop** — no user auth; `ApiSecured.js` sends a hardcoded merchant API key in the `Authorization` header. `utils/route-guard/*` there are dead copies importing a non-existent `context/`.

State management is React Context + `useReducer` in `src/context/` (no redux). Forms in the main app use formik + yup; the other two have neither.

### Layout (same in all three)

`pages/` route components, `sections/` feature components (main app groups them as `sections/@dashboard/<feature>/`), `layouts/` (dashboard shell with `SidebarConfig.js`, `LogoOnlyLayout`), `components/` generic UI, `theme/` MUI theme + overrides, `utils/` formatters and route guards, `_mocks_/` leftover template data. Routes are declared in `src/routes.js` with `useRoutes`.

Domain note: in the main UI "deposit" (`/dashboard/deposits`) means a bank *account*, matching the backend's `account-*-service`.

### Copy-drift

`theme/`, `components/{Page,Iconify,Logo,ScrollToTop}.js`, `layouts/{AuthLayout,LogoOnlyLayout}.js`, `context/{context,index}.js`, `utils/format*.js`, `utils/pkce.js`, `utils/tokenStorage.js`, `api/ApiSecured.js`, `api/AuthApi.js`, `pages/Login.js` and `pages/SuccessTinkoffPay.js` are copy-pasted across apps with small divergences. A fix in one usually needs to be mirrored; check the sibling apps.

### Payment flow across the apps

demo-shop `ProductCard` → `POST payment-service/public/order` → redirect to `payUrl` (payment-front `/?orderId=`) → `PaymentPage` fetches `public/order/{id}`, then either card (`public/pay/tinkoff`) or Apelsin account (`/apelsin`, guarded, `payment-service/pay`) → `/tinkoff/success` confirms via `public/pay/tinkoff/redirect` → back to the merchant's `redirectUrl`.
