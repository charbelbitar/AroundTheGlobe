Node.js + Express REST API backed by MySQL.

## Local setup

1. Copy `.env.example` to `.env` and fill in the values.
2. Ensure the `around_the_globe` MySQL database exists and your `schema.sql`/`seed.sql` have been applied.
3. Run `npm install`.
4. Run `npm run dev`.
5. Test `GET http://localhost:1337/api/health`.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/flights`
- `GET /api/flights/:flightId`
- `POST /api/flights` (admin)
- `PUT /api/flights/:flightId` (admin)
- `DELETE /api/flights/:flightId` (admin)
- `GET /api/bookings/me`
- `POST /api/bookings`
- `PATCH /api/bookings/:bookingId/cancel`
- `GET /api/bookings/flight/:flightId/passengers` (admin)
