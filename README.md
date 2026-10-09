<<<<<<< HEAD
# ai-finance-advisor
this is a task for full stack internship 
=======
# AI Personal Finance Advisor

Turns raw bank transaction CSVs into spending insights: upload a statement, see categorised
spending on a dashboard, and get an AI-generated plain-language summary with saving tips.

> Status: frontend and backend both fully implemented (see [PLAN.md](./PLAN.md) for the full
> architecture). Needs a real `DATABASE_URL` and `OPENROUTER_API_KEY` to run end-to-end — see
> Setup below. Without them the server still boots; auth/data calls return a clear error and
> `/insights/generate` returns a clear 503 until a key is set.

## Tech stack

- Frontend: React + Vite + TypeScript, Tailwind CSS, Recharts
- Backend: Node.js + Express + TypeScript, Prisma
- Database: PostgreSQL
- Auth: JWT in an HTTP-only cookie
- AI: OpenRouter API

## Setup

### Local development

```bash
# backend
cd backend
cp .env.example .env   # or edit the .env already there — fill in DATABASE_URL and OPENROUTER_API_KEY
npm install
npx prisma migrate dev --name init
npm run seed             # optional: creates demo@example.com / password123 with 62 sample transactions
npm run dev               # http://localhost:4000

# frontend
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev               # http://localhost:5173
```

You need a Postgres instance — any of these work: a local install, `postgres` via Docker
(`docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine`), or a free hosted
instance (Supabase, Neon, Railway). Point `DATABASE_URL` at it.

### Deploying the frontend to Vercel

The frontend is a static Vite build, so it deploys to Vercel as-is:

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo.
3. Set **Root Directory** to `frontend`. Vercel auto-detects the Vite framework preset
   (build command `npm run build`, output directory `dist`).
4. Add an environment variable `VITE_API_URL` pointing at the deployed backend's `/api`
   root (e.g. `https://your-backend.onrender.com/api`). Redeploy after changing it — Vite
   env vars are baked in at build time.
5. `frontend/vercel.json` already adds the SPA rewrite (`/* → /index.html`) so client-side
   routes like `/dashboard` work on refresh/direct link.

### Deploying the backend

The backend is a stateful Express server (not serverless), so it does **not** go on Vercel —
deploy it to Render, Railway, Fly.io, or similar. Set every variable from
`backend/.env.example` in that host's dashboard, pointing `CLIENT_ORIGIN` at the Vercel URL
and `DATABASE_URL` at your Postgres instance. `backend/Dockerfile` builds a production image
if the host wants a container; otherwise `npm run build && npm start` works directly.

**Cross-origin cookies**: the frontend (`*.vercel.app`) and backend (different host) are on
different origins, and auth uses an HTTP-only cookie. `backend/src/controllers/auth.controller.ts`
already branches on `NODE_ENV`: in production the cookie is set with `sameSite: "none"` and
`secure: true` (required for a cross-site cookie); in development it's `sameSite: "lax"` so it
works over plain `http://localhost`. CORS (`backend/src/app.ts`) only allows the origin(s) listed
in `CLIENT_ORIGIN` (comma-separate for multiple) with `credentials: true` — it will not work with
a wildcard `*` origin, by design.

## Environment variables

See [backend/.env.example](./backend/.env.example) and [frontend/.env.example](./frontend/.env.example).

## Design choices

**Categorisation** ([backend/src/services/categorization.service.ts](./backend/src/services/categorization.service.ts)):
rule-based keyword matching against [backend/src/constants/categories.ts](./backend/src/constants/categories.ts)
— fast, free, deterministic, and easy to explain. Each transaction's description is upper-cased
and tested against ordered regex rules (first match wins); unmatched rows fall into "Other". The
merchant name shown in the UI is a cleaned/title-cased version of the raw description with
trailing order/reference numbers stripped (`"SWIGGY ORDER 48213"` → `"Swiggy Order"`), so repeat
transactions from the same merchant collapse into one readable name in the Top Merchants chart.
A user's manual category edit (`PATCH /transactions/:id`) is never overwritten automatically.

**AI prompt** ([backend/src/services/insights.service.ts](./backend/src/services/insights.service.ts)):
rather than sending raw transaction rows to the LLM, the backend pre-aggregates the user's last
~90 days into category totals, monthly income/expense, savings rate, top merchants, and the 10
largest individual debits — then asks the model (via OpenRouter, any model) to return **strict
JSON** (`{summary, unusual, observations, tips}`) built only from that data, explicitly told not
to invent transactions. The response is validated with Zod before being saved, so a malformed
model reply surfaces as a clear "try again" error instead of corrupting the UI.

**Why this stack**: see [PLAN.md § 1](./PLAN.md#1-tech-stack-and-why).

## API

See [docs/API.md](./docs/API.md).

## Test credentials

After running `npm run seed` in `backend/`: **demo@example.com** / **password123** (62
transactions pre-loaded from `sample-data/sample_transactions.csv`, July 2025).

## Screenshots

See [docs/screenshots](./docs/screenshots).
>>>>>>> 3534962 (Scaffold AI Personal Finance Advisor: directory structure, stubs, plan, sample data)
