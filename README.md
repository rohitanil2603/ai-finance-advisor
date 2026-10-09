<<<<<<< HEAD
# ai-finance-advisor
this is a task for full stack internship 
=======
# AI Personal Finance Advisor

Turns raw bank transaction CSVs into spending insights: upload a statement, see categorised
spending on a dashboard, and get an AI-generated plain-language summary with saving tips.

> Status: frontend fully implemented against the planned API (see [PLAN.md](./PLAN.md)); backend
> not yet implemented. The frontend runs against `http://localhost:4000` by default and shows
> the login screen until a backend is available — screens that call the API will error until
> then, which is expected.

## Tech stack

- Frontend: React + Vite + TypeScript, Tailwind CSS, Recharts
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL via Prisma
- Auth: JWT in an HTTP-only cookie
- AI: OpenRouter API

## Setup

### Local development

```bash
# backend (not yet implemented — see PLAN.md)
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, OPENROUTER_API_KEY
npm install
npx prisma migrate dev
npm run dev             # http://localhost:4000

# frontend
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:4000/api
npm install
npm run dev              # http://localhost:5173
```

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

**Cross-origin cookies**: the frontend (`*.vercel.app`) and backend will be on different
domains, and auth uses an HTTP-only cookie (`apiClient` sets `withCredentials: true`). Once
the backend exists, its cookie must be set with `sameSite: "none"` and `secure: true` in
production, and CORS must allow the exact Vercel origin with `credentials: true` (not `*`).
This only matters in production — on localhost both apps share `localhost` so a normal
`sameSite: "lax"` cookie works.

## Environment variables

See [backend/.env.example](./backend/.env.example) and [frontend/.env.example](./frontend/.env.example).

## Design choices

_To be filled in: categorisation approach, AI prompt design, why this stack — see PLAN.md
sections 5 and 6 for the draft version of this._

## API

See [docs/API.md](./docs/API.md).

## Test credentials

_To be filled in once auth + seed data are implemented._

## Screenshots

See [docs/screenshots](./docs/screenshots).
>>>>>>> 3534962 (Scaffold AI Personal Finance Advisor: directory structure, stubs, plan, sample data)
