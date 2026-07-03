# Company RBAC Backend

Express + MongoDB API for company signup/login and authenticated employer/employee management.

## Setup

1. Copy `.env.example` to `.env`.
2. Add your MongoDB connection string in `MONGODB_URI`.
3. Set a strong `JWT_SECRET`.
4. Run:

```bash
npm install
npm run dev
```

## API

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/dashboard/summary`
- `GET /api/employers`
- `POST /api/employers`
- `PUT /api/employers/:id`
- `DELETE /api/employers/:id`
- `GET /api/employees`
- `POST /api/employees`
- `PUT /api/employees/:id`
- `DELETE /api/employees/:id`

Protected routes require:

```http
Authorization: Bearer <jwt>
```

## Privacy and tenant scope

Employer and employee APIs are scoped from the JWT token only. The frontend or API client must not send `company` or `companyId` in the request body or query string.

- `Authorization: Bearer <jwt>` identifies the company.
- List APIs return only records owned by the token's company.
- Update/delete APIs include the token company in the MongoDB filter, so another company gets `404` for records it does not own.
- Requests that try to send `company` or `companyId` are rejected with `400`.
