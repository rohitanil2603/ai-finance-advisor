# API Reference

Base URL: `http://localhost:4000/api` locally, or `<your-backend-host>/api` in production.
All endpoints except `/auth/register` and `/auth/login` require the `fa_session` HTTP-only
cookie set by those two calls (sent automatically by the browser with `credentials: "include"`).

## Auth

### POST /auth/register
Request body: `{ "email": string, "password": string (min 8 chars) }`
Response (201):
```json
{ "id": "cuid", "email": "demo@example.com", "createdAt": "2026-10-09T05:14:18.795Z" }
```
Errors: `400` validation, `409` email already registered.

### POST /auth/login
Request body: `{ "email": string, "password": string }`
Response (200): same shape as register.
Errors: `400` validation, `401` invalid credentials.

### POST /auth/logout
No body. Response: `204`.

### GET /auth/me
Response (200): current user, same shape as register. `401` if not authenticated.

## Transactions

All routes below require auth and are scoped to the logged-in user.

### POST /transactions/upload
`multipart/form-data` with field `file` (a `.csv`, max `MAX_UPLOAD_SIZE_MB`).
Response (200):
```json
{ "imported": 62, "skipped": 0, "errors": [{ "row": 3, "message": "Invalid or missing date: \"n/a\"" }] }
```
`skipped` counts rows that parsed fine but were exact duplicates of an existing transaction
(same user, date, raw description, and amount). `errors` lists rows that failed validation and
were not imported — the rest of the file still imports.

### GET /transactions
Query params (all optional): `from`, `to` (YYYY-MM-DD), `category` (one of the fixed category
list), `minAmount`, `maxAmount`, `search`, `page` (default 1), `pageSize` (default 20, max 100).
Response (200):
```json
{
  "data": [{ "id": "...", "date": "2025-07-02", "description": "Swiggy Order", "rawDescription": "SWIGGY ORDER 48213", "amount": -540.5, "balance": 114459.5, "category": "Food", "isRecurring": false, "createdAt": "..." }],
  "total": 62, "page": 1, "pageSize": 20
}
```

### PATCH /transactions/:id
Request body: `{ "category": "Food" }` (must be one of the fixed category list).
Response (200): the updated transaction. `404` if not found / not owned by the caller.

### DELETE /transactions/:id
Response: `204`. `404` if not found / not owned.

### GET /transactions/export?month=YYYY-MM
Bonus. Streams a CSV file (`text/csv`) of that calendar month's transactions.

## Dashboard

### GET /dashboard/summary?from&to
Response (200):
```json
{ "totalIncome": 80120.55, "totalExpense": 99396.45, "savingsRate": -0.24, "transactionCount": 62 }
```

### GET /dashboard/charts?from&to
Response (200):
```json
{
  "byCategory": [{ "category": "Food", "total": 24197.45 }],
  "monthly": [{ "month": "2025-07", "income": 80120.55, "expense": 99396.45 }],
  "trend": [{ "date": "2025-07-02", "amount": 770.5 }],
  "topMerchants": [{ "merchant": "Swiggy Order", "total": 3730, "count": 7 }]
}
```

## AI Insights

### GET /insights
Response (200): the most recently generated insight, or `null` if none exists yet.

### POST /insights/generate
Builds a compact summary of the user's last ~90 days of transactions (category totals, monthly
totals, savings rate, top merchants, and the 10 largest debit transactions — not every raw row),
sends it to the configured OpenRouter model, validates the structured response, and saves it.
Response (200):
```json
{
  "id": "...", "periodStart": "2025-07-01", "periodEnd": "2025-07-31",
  "summary": "...", "unusual": [{ "id": "u-0", "description": "Rent Payment", "amount": -18000, "date": "2025-07-03", "reason": "..." }],
  "observations": ["..."], "tips": ["...", "...", "..."], "createdAt": "..."
}
```
Errors: `400` if the user has no transactions yet, `503` if `OPENROUTER_API_KEY` is not set,
`502`/`504` if the AI provider errors or times out.

## Budgets (bonus)

### GET /budgets
Response: `[{ "id": "...", "category": "Food", "monthlyLimit": 20000 }]`

### POST /budgets
Request body: `{ "category": "Food", "monthlyLimit": 20000 }`. Upserts by category.

### GET /budgets/status
Response: `[{ "category": "Food", "monthlyLimit": 20000, "spent": 4200, "ratio": 0.21, "status": "ok" | "near" | "over" }]`
`spent` is this calendar month's spend in that category. `status` is `"near"` at >=80% and
`"over"` at >=100%.
