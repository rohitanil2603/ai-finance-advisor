# AI Personal Finance Advisor — Architecture & Build Plan

This is the working plan for the Full Stack Developer task. It documents the tech stack,
the complete directory structure, what each file is responsible for, the data model, the
API surface, and the build order. Use this as the reference when asking for any individual
file to be implemented.

## 1. Tech stack (and why)

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite + TypeScript | Fast dev loop, suggested in the brief, no SSR needed for this app |
| Charts | Recharts | Suggested in the brief, composable React components |
| Styling | Tailwind CSS | Fast to build a clean, responsive UI without a design system |
| Backend | Node.js + Express + TypeScript | One language across the stack, suggested in the brief |
| ORM / DB | Prisma + PostgreSQL | Typed queries, easy migrations, relational data fits transactions well |
| Auth | JWT stored in an HTTP-only cookie | Suggested in the brief; avoids localStorage XSS exposure |
| CSV parsing | `csv-parse` (backend) | Server-side validation is required regardless of what the client does |
| Validation | Zod | Shared validation style for env vars, request bodies, and LLM output shape |
| File upload | Multer (memory storage) | Small CSVs (<5MB), no need to persist the raw file |
| LLM | OpenRouter API | Single API key, model-agnostic (can swap models without code changes) |
| Password hashing | bcrypt | Standard |
| Testing | Vitest | Fast, works for both unit and lightweight integration tests |

Monorepo with two top-level apps (`backend/`, `frontend/`) rather than a single Next.js app,
so the Express API and data-processing layer are clearly separated from the UI — closer to
how this would be built in a real job, and makes the "API list with sample requests" deliverable
natural (it's just the Express routes).

## 2. Directory structure

```
ai-finance-advisor/
├── README.md                     # setup, env vars, design choices (submission requirement)
├── PLAN.md                       # this file
├── .gitignore
├── docker-compose.yml            # bonus: db + backend + frontend
├── sample-data/
│   └── sample_transactions.csv   # 60-row sample CSV for testing/demo/seed
├── docs/
│   ├── API.md                    # endpoint list with sample request/response
│   └── screenshots/              # dashboard + insights screenshots/GIF for submission
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma         # User, Transaction, Insight, (Budget) models
│   │   └── seed.ts               # seeds a demo user + sample transactions
│   ├── src/
│   │   ├── index.ts              # entry point — starts the server
│   │   ├── app.ts                # express app + middleware + route mounting
│   │   ├── config/
│   │   │   ├── env.ts            # validated, typed env config
│   │   │   └── db.ts             # Prisma client singleton
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   ├── upload.middleware.ts
│   │   │   └── validate.middleware.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── transactions.routes.ts
│   │   │   ├── dashboard.routes.ts
│   │   │   ├── insights.routes.ts
│   │   │   └── budgets.routes.ts         # bonus
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── transactions.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   ├── insights.controller.ts
│   │   │   └── budgets.controller.ts     # bonus
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── csvParser.service.ts
│   │   │   ├── categorization.service.ts
│   │   │   ├── transactions.service.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── llm.service.ts
│   │   │   ├── insights.service.ts
│   │   │   ├── recurring.service.ts      # bonus
│   │   │   └── export.service.ts         # bonus
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   ├── date.ts
│   │   │   ├── errors.ts
│   │   │   └── logger.ts
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   ├── transaction.types.ts
│   │   │   └── insights.types.ts
│   │   ├── validators/
│   │   │   ├── auth.validators.ts
│   │   │   └── transaction.validators.ts
│   │   └── constants/
│   │       └── categories.ts
│   └── tests/
│       ├── auth.test.ts
│       ├── categorization.test.ts
│       └── csvParser.test.ts
│
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── index.html
    ├── .env.example
    ├── Dockerfile
    ├── tailwind.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── router.tsx
        ├── index.css
        ├── api/
        │   ├── client.ts
        │   ├── auth.api.ts
        │   ├── transactions.api.ts
        │   ├── dashboard.api.ts
        │   └── insights.api.ts
        ├── context/
        │   └── AuthContext.tsx
        ├── hooks/
        │   ├── useAuth.ts
        │   ├── useTransactions.ts
        │   ├── useDashboard.ts
        │   └── useInsights.ts
        ├── pages/
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── DashboardPage.tsx
        │   ├── TransactionsPage.tsx
        │   ├── UploadPage.tsx
        │   ├── InsightsPage.tsx
        │   └── NotFoundPage.tsx
        ├── components/
        │   ├── layout/
        │   │   ├── AppLayout.tsx
        │   │   ├── Navbar.tsx
        │   │   ├── Sidebar.tsx
        │   │   └── ProtectedRoute.tsx
        │   ├── charts/
        │   │   ├── CategoryPieChart.tsx
        │   │   ├── IncomeExpenseBarChart.tsx
        │   │   ├── SpendingTrendLineChart.tsx
        │   │   └── TopMerchantsList.tsx
        │   ├── transactions/
        │   │   ├── TransactionTable.tsx
        │   │   ├── TransactionFilters.tsx
        │   │   ├── CategoryEditDropdown.tsx
        │   │   └── CsvUploadForm.tsx
        │   ├── insights/
        │   │   ├── InsightsSummaryCard.tsx
        │   │   ├── UnusualTransactionsList.tsx
        │   │   ├── SavingTipsList.tsx
        │   │   └── GenerateInsightsButton.tsx
        │   └── ui/
        │       ├── Button.tsx
        │       ├── Card.tsx
        │       ├── Input.tsx
        │       ├── Spinner.tsx
        │       ├── ErrorBanner.tsx
        │       └── DateRangePicker.tsx
        ├── types/
        │   ├── auth.ts
        │   ├── transaction.ts
        │   └── insights.ts
        └── utils/
            ├── formatCurrency.ts
            └── formatDate.ts
```

Every file above already exists as a stub (with a one-line comment describing its job) under
`/home/rohit/Desktop/ai-finance-advisor`. Ask for any one (or a group, e.g. "implement all
auth files") and it'll be filled in.

## 3. Data model (Prisma)

```
User
  id            String   @id @default(cuid())
  email         String   @unique
  passwordHash  String
  createdAt     DateTime @default(now())
  transactions  Transaction[]
  insights      Insight[]
  budgets       Budget[]        // bonus

Transaction
  id            String   @id @default(cuid())
  userId        String
  date          DateTime
  description   String            // cleaned/normalised merchant text
  rawDescription String           // original text from the CSV, for reference
  amount        Decimal           // negative = debit, positive = credit
  balance       Decimal?
  category      String            // Food, Rent, Travel, Shopping, Bills, Income, Other, ...
  isRecurring   Boolean  @default(false)  // bonus
  createdAt     DateTime @default(now())
  @@index([userId, date])
  @@unique([userId, date, rawDescription, amount])  // dedupe guard

Insight
  id            String   @id @default(cuid())
  userId        String
  periodStart   DateTime
  periodEnd     DateTime
  summary       String            // plain-language spending summary
  unusual       Json              // unusual/high transactions array
  observations  Json              // category-level observations array
  tips          Json              // 3-5 saving tips array
  rawResponse   Json              // full LLM response, for debugging
  createdAt     DateTime @default(now())

Budget   // bonus
  id            String   @id @default(cuid())
  userId        String
  category      String
  monthlyLimit  Decimal
  @@unique([userId, category])
```

## 4. API surface

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | create user, set session cookie |
| POST | /api/auth/login | no | verify credentials, set session cookie |
| POST | /api/auth/logout | yes | clear session cookie |
| GET | /api/auth/me | yes | return current user |
| POST | /api/transactions/upload | yes | upload + parse + clean + categorise + store CSV |
| GET | /api/transactions | yes | list with `?from&to&category&minAmount&maxAmount&search&page` |
| PATCH | /api/transactions/:id | yes | edit category |
| DELETE | /api/transactions/:id | yes | remove a transaction |
| GET | /api/dashboard/summary | yes | totals, income vs expense, savings rate for a range |
| GET | /api/dashboard/charts | yes | category breakdown, monthly series, trend, top merchants |
| GET | /api/insights | yes | latest saved insight (or null) |
| POST | /api/insights/generate | yes | build summary, call LLM, save, return |
| GET/POST/PUT | /api/budgets | yes | bonus |
| GET | /api/budgets/status | yes | bonus: which categories are near/over budget |

Full request/response samples go in `docs/API.md` as each route is implemented.

## 5. Categorisation approach

Rule-based first, LLM as a fallback/enhancer — fast, free, deterministic for the common cases,
and explainable in the README ("how categorisation works" is a submission requirement):

1. `categorization.service.ts` normalises the description (uppercase, strip transaction IDs/
   reference numbers, trim whitespace).
2. It matches against a keyword table in `constants/categories.ts`
   (e.g. `SWIGGY|ZOMATO|RESTAURANT` → Food, `UBER|OLA|PETROL` → Travel,
   `RENT|LANDLORD` → Rent, `NETFLIX|SPOTIFY|PRIME` → Bills, `SALARY|CREDIT.*SALARY` → Income).
3. Anything unmatched falls into `Other`. A later enhancement point (not required for MVP) is
   batching unmatched rows into a single LLM call to suggest categories, with the result cached.
4. The user can always override via `PATCH /api/transactions/:id`, which is the source of
   truth going forward (manual edits should not be overwritten by re-categorisation).

## 6. AI insights approach

1. `analytics.service.ts` computes a compact JSON summary for the selected period: category
   totals, monthly totals, income vs expense, savings rate, top 5 merchants, and the
   largest/most unusual transactions (e.g. z-score outliers per category or simply top-N by
   amount) — **not** the raw transaction list.
2. `insights.service.ts` turns that summary into a prompt instructing the model to return
   strict JSON: `{ summary, unusual: [...], observations: [...], tips: [...] }`.
3. `llm.service.ts` calls OpenRouter's `/chat/completions` endpoint (OpenAI-compatible) with
   that prompt, `response_format: { type: "json_object" }` where supported, and a timeout.
4. The parsed result is validated (Zod) and saved as an `Insight` row scoped to the user and
   date range, so `GET /api/insights` just reads it back — generation only happens when the
   user clicks "Generate" (or the result is stale/missing).
5. Failure handling: `GenerateInsightsButton.tsx` shows a loading state while the POST is in
   flight, an `ErrorBanner` with a retry action on failure, and the backend returns a clear
   4xx/5xx with a message rather than letting the raw OpenRouter error leak through.

## 7. Suggested build order

1. **Backend skeleton**: `package.json`, `tsconfig.json`, `app.ts`, `index.ts`, `config/`,
   Prisma schema + migration, health-check route.
2. **Auth**: validators, `auth.service.ts`, `auth.controller.ts`, `auth.routes.ts`,
   `jwt.ts`, `password.ts`, `auth.middleware.ts`.
3. **CSV upload & transactions CRUD**: `upload.middleware.ts`, `csvParser.service.ts`,
   `categorization.service.ts`, `transactions.service.ts`, controller + routes.
4. **Dashboard analytics**: `analytics.service.ts`, dashboard controller + routes.
5. **Frontend skeleton**: Vite app, Tailwind, router, `AuthContext`, `ProtectedRoute`,
   login/register pages wired to the real API.
6. **Transactions UI**: upload form, table, filters, category edit.
7. **Dashboard UI**: the four charts + summary cards, wired to real filtered data.
8. **AI insights**: `llm.service.ts`, `insights.service.ts`, insights routes, then the
   insights page/components.
9. **Polish**: responsive pass, error states, README, API docs, screenshots.
10. **Bonus features**: budgets, recurring-payment detection, Q&A, export, Docker.

## 8. Environment variables

See `backend/.env.example` and `frontend/.env.example`. Never commit a real `.env`.

## 9. Open decisions to confirm before/while building

- Exact OpenRouter model to default to (cheap + fast vs. higher quality) — currently set to
  `anthropic/claude-3.5-haiku` as a placeholder in `.env.example`.
- Whether categories are a fixed enum or free-text with suggestions — currently free-text
  constrained by the keyword table + "Other" fallback, editable by the user.
