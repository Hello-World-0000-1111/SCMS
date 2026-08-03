# Smart Complaint Management System (SCMS)

A full-stack complaint management application with three user roles: **User**, **Admin**, and **Staff**.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS, Axios |
| Backend  | Spring Boot 3.2, Java 17, JWT, H2   |
| API      | REST at `http://localhost:8080/api` |

## Prerequisites

Download and install these before running the project:

1. **Node.js 18+** — [https://nodejs.org](https://nodejs.org)
2. **Java JDK 17** (recommended) — [https://adoptium.net](https://adoptium.net)  
   > Use JDK 17 for the backend. Java 21+ may work; Java 25 can cause Lombok compile errors.
3. **Apache Maven 3.8+** — [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)
4. **Git** (optional) — [https://git-scm.com](https://git-scm.com)

## Project Structure

```
scms/
├── Backend/          # Spring Boot REST API
├── Frontend/         # React SPA
└── README.md
```

## Quick Start

### 1. Start the Backend

```bash
cd Backend
mvn spring-boot:run
```

The API starts at **http://localhost:8080**.

H2 in-memory database is used by default. Console: **http://localhost:8080/h2-console**
- JDBC URL: `jdbc:h2:mem:scmsdb`
- Username: `sa`
- Password: *(empty)*

### 2. Start the Frontend

Open a new terminal:

```bash
cd Frontend
npm install
npm run dev
```

The app opens at **http://localhost:5173**.

## Demo Accounts

Seeded automatically on first backend startup:

| Role  | Email            | Password     |
|-------|------------------|--------------|
| Admin | admin@scms.com   | password123  |
| Staff | staff@scms.com   | password123  |
| User  | user@scms.com    | password123  |

**Organization code for registration:** `SCMS001`

## Features by Role

### User
- `/dashboard` — View own complaints as cards
- `/complaints/new` — File a new complaint
- `/complaints/:id` — Complaint detail with status timeline

### Admin
- `/admin/dashboard` — Stats cards + filterable complaints table
- `/admin/complaints` — All complaints with assign action
- `/admin/assign/:id` — Assign complaint to staff
- `/admin/users` — Manage user roles

### Staff
- `/staff/dashboard` — Assigned complaints
- `/staff/complaints/:id` — Complaint detail with notes
- `/staff/update-status/:id` — Update status (In Progress / Resolved / Closed)

## API Endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/register`

### User
- `GET /api/complaints/my`
- `POST /api/complaints`
- `GET /api/complaints/{id}`

### Admin
- `GET /api/admin/complaints/stats`
- `GET /api/admin/complaints`
- `PUT /api/admin/complaints/{id}/assign`
- `GET /api/admin/users`
- `PUT /api/admin/users/{id}/role`
- `GET /api/admin/staff`

### Staff
- `GET /api/staff/complaints`
- `PUT /api/staff/complaints/{id}/status`

## Production Build

```bash
# Frontend
cd Frontend
npm run build
# Output in Frontend/dist/

# Backend
cd Backend
mvn clean package
# JAR in Backend/target/scms-backend-0.0.1-SNAPSHOT.jar
java -jar target/scms-backend-0.0.1-SNAPSHOT.jar
```

## PostgreSQL (Optional)

Uncomment PostgreSQL settings in `Backend/src/main/resources/application.properties` and comment out the H2 section.

## Troubleshooting

- **CORS errors:** Ensure backend runs on port 8080 and frontend on 5173.
- **401 on API calls:** Log in again; JWT is stored in `localStorage`.
- **Backend won't compile:** Use Java 17. Set `JAVA_HOME` to your JDK 17 install before running Maven.
- **Registration fails:** Use org code `SCMS001` and a unique employee ID.
