# API Reference

Fill this in as each route is implemented. Structure to follow for every endpoint:

```
### METHOD /path
Auth required: yes/no
Request body / query params:
Response (200):
Error responses:
```

Planned endpoints (see PLAN.md for full detail):

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me
- POST /api/transactions/upload
- GET /api/transactions
- PATCH /api/transactions/:id
- DELETE /api/transactions/:id
- GET /api/dashboard/summary
- GET /api/dashboard/charts
- GET /api/insights
- POST /api/insights/generate
- GET /api/budgets (bonus)
- POST /api/budgets (bonus)
- PUT /api/budgets/:id (bonus)
- GET /api/budgets/status (bonus)
