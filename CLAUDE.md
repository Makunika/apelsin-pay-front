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

`npm test` exists but there are no test files in any app. The `start` script in `apelsin-payment-front` / `apelsin-payment-demo-shop` uses Windows `set PORT=...` syntax, which is a no-op on macOS/Linux — pass `PORT=3006 npm start` yourself when running two apps at once (the auth server whitelists `localhost:3000` and `localhost:3006` as redirect URIs).

```bash
docker compose up --build    # builds all four images (node:18-alpine build → nginx:alpine)
```

The balancer proxies to `gateway` and `auth-service` which are defined in the backend repo's compose; the two stacks must share a Docker network for that to work.

## Architecture

### Backend URLs are hardcoded

There are no `.env` files and no `process.env` usage. Prod URLs are literals in each app's `src/api/ApiSecured.js` (`BASE_URL = "http://api.graduate.pshiblo.xyz/"`, with the `localhost:8080` variant commented out) and `src/api/AuthApi.js` (`login.graduate.pshiblo.xyz` + `redirect_uri`). Also in `apelsin-pay-front/src/context/actions.js` (token-exchange redirect_uri), `apelsin-pay-front/src/routes.js` (demoshop link) and `apelsin-payment-demo-shop/src/sections/ProductCard.js` (`redirectUrl`, `companyId: 4`). To point at a local backend, edit these; the last commit message notes this should move to env vars.

Backend services are addressed as path prefixes on the single gateway, exported from `ApiSecured.js`: `URL_AUTH`, `URL_TRANSACTION`, `URL_INFO_BUSINESS`, `URL_INFO_PERSONAL`, `URL_ACCOUNT_PERSONAL`, `URL_ACCOUNT_BUSINESS`, `URL_PAYMENT`, `URL_USERS` — e.g. `apiSecured.get(\`${URL_TRANSACTION}api/transaction/...\`)`. Endpoints under `/public/` need no token.

### Three different auth schemes

- **apelsin-pay-front** — OAuth2 *authorization_code*, client `browser_main`, scope `user`. `utils/route-guard/AuthGuard.js` redirects to the auth server; `pages/Login.js` reads `?code=` and `context/actions.js` exchanges it at `auth-service/oauth/token` with `Basic btoa("browser_main:")`. Tokens live in `localStorage.currentUser` and in `axios-jwt`, whose interceptor on `apiSecured` adds the bearer and refreshes via `refresh_token`. Roles come from the JWT `authorities` claim (`utils/userUtils.js`: `ROLE_MODERATOR`, `ROLE_ADMINISTRATOR`) and gate routes via `ModeratorGuard`.
- **apelsin-payment-front** — OAuth2 *implicit*, client `browser_payment`, scope `user_payment`, order id carried in `state`. `pages/Login.js` parses `access_token` from the URL hash; token stored in `localStorage.token` with a hand-written interceptor that checks `exp` and clears storage. No refresh.
- **apelsin-payment-demo-shop** — no user auth; `ApiSecured.js` sends a hardcoded merchant API key in the `Authorization` header. `utils/route-guard/*` there are dead copies importing a non-existent `context/`.

State management is React Context + `useReducer` in `src/context/` (no redux). Forms in the main app use formik + yup; the other two have neither.

### Layout (same in all three)

`pages/` route components, `sections/` feature components (main app groups them as `sections/@dashboard/<feature>/`), `layouts/` (dashboard shell with `SidebarConfig.js`, `LogoOnlyLayout`), `components/` generic UI, `theme/` MUI theme + overrides, `utils/` formatters and route guards, `_mocks_/` leftover template data. Routes are declared in `src/routes.js` with `useRoutes`.

Domain note: in the main UI "deposit" (`/dashboard/deposits`) means a bank *account*, matching the backend's `account-*-service`.

### Copy-drift

`theme/`, `components/{Page,Iconify,Logo,ScrollToTop}.js`, `layouts/{AuthLayout,LogoOnlyLayout}.js`, `context/{context,index}.js`, `utils/format*.js`, `api/ApiSecured.js`, `api/AuthApi.js`, `pages/Login.js` and `pages/SuccessTinkoffPay.js` are copy-pasted across apps with small divergences. A fix in one usually needs to be mirrored; check the sibling apps.

### Payment flow across the apps

demo-shop `ProductCard` → `POST payment-service/public/order` → redirect to `payUrl` (payment-front `/?orderId=`) → `PaymentPage` fetches `public/order/{id}`, then either card (`public/pay/tinkoff`) or Apelsin account (`/apelsin`, guarded, `payment-service/pay`) → `/tinkoff/success` confirms via `public/pay/tinkoff/redirect` → back to the merchant's `redirectUrl`.
