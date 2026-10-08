# AroundTheGlobe
AroundTheGlobe is a full-stack flight booking web application built with React, Node.js, Express, and MySQL.
The application supports user authentication, flight reservations, booking management, and an administrative dashboard.

## Tech Stack
- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js
- Database: MySQL
- Authentication: Express sessions, bcrypt
- Email: Nodemailer
- API: REST

## Features
- User registration and login
- Role-based access control (User/Admin)
- Flight browsing and search
- Server-side pagination
- Flight booking with seat availability checks
- Booking cancellation
- Password reset via email
- Booking confirmation and cancellation emails
- Admin flight management (CRUD)
- Admin dashboard with statistics and charts

## Project Structure
- `backend/` — Express REST API
- `frontend/` — React application
- `database/` — SQL schema and sample data
- `documentation.docx` — Technical documentation

## Local Setup
1. Clone the repository.
2. Create the MySQL database using the SQL scripts in `database/`.
3. Install backend and frontend dependencies using `npm install`.
4. Configure environment variables using `.env.example`.
5. Start the backend and frontend using `npm run dev`.

## Documentation
See "AroundTheGlobe Documentation.docx" for more details about the architecture and implementation.

## Status
Dockerization, automated testing, and deployment are planned.