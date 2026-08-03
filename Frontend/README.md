## API Endpoints Reference

The backend server runs by default at:

```text
http://localhost:8080
```

### Authentication APIs

| Method | Endpoint                                  | Description       | Controller     |
| ------ | ----------------------------------------- | ----------------- | -------------- |
| POST   | `http://localhost:8080/api/auth/login`    | User login        | AuthController |
| POST   | `http://localhost:8080/api/auth/register` | User registration | AuthController |

### User APIs

| Method | Endpoint                                    | Description                     | Controller          |
| ------ | ------------------------------------------- | ------------------------------- | ------------------- |
| GET    | `http://localhost:8080/api/complaints/my`   | Get logged-in user's complaints | ComplaintController |
| POST   | `http://localhost:8080/api/complaints`      | Create a new complaint          | ComplaintController |
| GET    | `http://localhost:8080/api/complaints/{id}` | Get complaint by ID             | ComplaintController |

### Admin APIs

| Method | Endpoint                                                 | Description               | Controller      |
| ------ | -------------------------------------------------------- | ------------------------- | --------------- |
| GET    | `http://localhost:8080/api/admin/complaints/stats`       | Get complaint statistics  | AdminController |
| GET    | `http://localhost:8080/api/admin/complaints`             | List all complaints       | AdminController |
| PUT    | `http://localhost:8080/api/admin/complaints/{id}/assign` | Assign complaint to staff | AdminController |
| GET    | `http://localhost:8080/api/admin/users`                  | List all users            | AdminController |
| PUT    | `http://localhost:8080/api/admin/users/{id}/role`        | Update user role          | AdminController |

### Staff APIs

| Method | Endpoint                                                 | Description              | Controller      |
| ------ | -------------------------------------------------------- | ------------------------ | --------------- |
| GET    | `http://localhost:8080/api/staff/complaints`             | List assigned complaints | StaffController |
| PUT    | `http://localhost:8080/api/staff/complaints/{id}/status` | Update complaint status  | StaffController |

---

## Running the Application

### Start Backend

```bash
cd Backend
..\apache-maven-3.9.16\bin\mvn.cmd spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### H2 Database Console

```text
http://localhost:8080/h2-console
```

Configuration:

```text
JDBC URL: jdbc:h2:mem:scmsdb
Username: sa
Password:
```

### Testing APIs

You can test the APIs using:

* Postman
* Insomnia
* Thunder Client (VS Code)

Example:

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@scms.com",
  "password": "password"
}
```





{
  "email": "admin@scms.com",
  "password": "password123"
}
