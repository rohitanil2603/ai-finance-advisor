<<<<<<< HEAD
# ai-finance-advisor
this is a task for full stack internship 
=======
# AI Personal Finance Advisor

Turns raw bank transaction CSVs into spending insights: upload a statement, see categorised
spending on a dashboard, and get an AI-generated plain-language summary with saving tips.

> Status: scaffolded, not yet implemented. See [PLAN.md](./PLAN.md) for the full architecture,
> directory structure, data model, API surface, and build order.

## Tech stack

- Frontend: React + Vite + TypeScript, Tailwind CSS, Recharts
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL via Prisma
- Auth: JWT in an HTTP-only cookie
- AI: OpenRouter API

## Setup

_To be filled in as the backend and frontend are implemented._

```bash
# backend
cd backend
cp .env.example .env   # fill in DATABASE_URL, JWT_SECRET, OPENROUTER_API_KEY
npm install
npx prisma migrate dev
npm run dev

# frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```

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
