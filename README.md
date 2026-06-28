# PocketSync API

REST API for PocketSync: link Nigerian bank and fintech accounts, read balances and transactions, transfer money, and pay bills.

The React client lives in the parent repo (`pocketsync-groupten-mvp/`). CORS expects your frontend origin in `ALLOWED_ORIGIN`.

## Features

| Area | Notes |
|------|--------|
| Auth | Register, login, email OTP, password reset. JWT in HttpOnly cookies. |
| Accounts | Link/disconnect GTBank, Access Bank, Kuda, Opay, Moniepoint |
| Transactions | List, filter, recategorise |
| Transfers | Between linked accounts; external bank send (simulated NIP) |
| Bills | DSTV, GOTV, electricity, telco, LAWMA, water (simulated biller) |
| Dashboard | Summary and 6-month balance trend |

Account linking, external transfers, and bill pay update balances in MongoDB but do not call real bank or biller APIs.

## Supported institutions (linking)

GTBank, Access Bank, Kuda, Opay, Moniepoint.

Bill providers: DSTV, GOTV, IKEDC, EKEDC, MTN, Airtel, Glo, 9mobile, LAWMA, Water Board.

## Transfer endpoints

**Internal** — `POST /transactions/transfer`  
Move money between two linked accounts you own. Debits one account and credits the other.

**External** — `POST /transactions/interbank-transfer`  
Send to any 10-digit Nigerian account. Debits your linked account only. Returns a test `nipReference`.

**Bill pay** — `POST /transactions/pay-bill`  
Debit a linked account for a whitelisted `billProvider`.

Amounts are in NGN. Minimum ₦1.

## Stack

Node.js, Express 4, TypeScript, MongoDB (Mongoose), bcrypt, Helmet, rate limiting.

## Setup

```bash
cd pocketsync-backend
yarn install
cp .env.example .env
yarn seed   # optional
yarn dev
```

API: `http://localhost:5000`  
Health: `GET /health`

**Seed login:** `demo@pocketsync.ng` / `Demo@1234`

## Environment

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default `5000`) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | Access token secret (32+ chars) |
| `JWT_REFRESH_SECRET` | Refresh token secret (32+ chars) |
| `JWT_ACCESS_EXPIRES_IN` | e.g. `15m` |
| `JWT_REFRESH_EXPIRES_IN` | e.g. `7d` |
| `ALLOWED_ORIGIN` | Frontend origin for CORS |
| `NODE_ENV` | `development` or `production` |

Do not commit `.env`.

## API base

`http://localhost:5000/api/v1`

Auth uses cookies set by `POST /auth/login`. Send cookies on protected routes (`credentials: 'include'`).

Full request/response shapes: [`docs/API-INTEGRATION.md`](docs/API-INTEGRATION.md) and [`docs/openapi.yaml`](docs/openapi.yaml).

### Quick reference

| Method | Path | Auth |
|--------|------|------|
| POST | `/auth/register` | No |
| POST | `/auth/login` | No |
| POST | `/auth/logout` | Yes |
| POST | `/auth/refresh` | Cookie |
| GET | `/institutions` | No |
| POST | `/accounts/link` | Yes |
| GET | `/accounts` | Yes |
| DELETE | `/accounts/:accountId` | Yes |
| GET | `/transactions` | Yes |
| POST | `/transactions/transfer` | Yes |
| POST | `/transactions/interbank-transfer` | Yes |
| POST | `/transactions/pay-bill` | Yes |
| GET | `/dashboard/summary` | Yes |
| GET | `/dashboard/balance-trend` | Yes |

## Postman

1. Set `baseUrl` = `http://localhost:5000`
2. Login with demo credentials
3. Copy account IDs from `GET /accounts`
4. Try transfer or pay-bill endpoints

## Security notes

- HttpOnly cookies for tokens
- Refresh token rotation stored server-side
- Rate limits on auth, linking, and payments
- Queries scoped to the logged-in user
- Transaction descriptions sanitised on write
- Account numbers stored masked (`****1234`)

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Dev server with reload |
| `yarn build` | Compile to `dist/` |
| `yarn start` | Run production build |
| `yarn seed` | Load demo user and sample data |