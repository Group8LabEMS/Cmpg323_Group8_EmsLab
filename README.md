# LabEMS — Lab Equipment Management System

LabEMS is a full-stack web application for managing laboratory equipment, bookings, maintenance, and audit logs. It was developed as part of the CMPG323 group project and provides an API backend, a JavaScript frontend, database schema and seed data, and automated tests for core services.

This README contains quick start instructions, an overview of the architecture and tech stack, configuration notes, testing instructions and links to the user manual.

## Contents
- Overview
- Quick start (local development)
- Configuration
- Tech stack
- Running tests
- Contributing
- Where to find the User Manual

## Overview
Key features:
- Manage equipment records (CRUD)
- Book equipment with date/time tracking
- Track maintenance schedules and history
- Role-based user management (Admin / Manager / User)
- Audit logging for important system events
- Email notifications (booking confirmations, cancellations, maintenance reminders)

High-level architecture:
- Backend: ASP.NET Core Web API (controllers, services, EF Core)
- Frontend: Vite-powered JavaScript pages (some Lit components and Chart.js for charts)
- Database: MySQL with SQL schema and seed scripts in `/database`
- Tests: xUnit + Moq for unit testing

## Quick start (local development)
Prerequisites:
- .NET SDK 8.0 or later
- Node.js (16+ recommended) and npm
- Docker (optional but recommended for MySQL)

1) Start the database (Docker recommended)

PowerShell example:
```powershell
# Pull and run MySQL 8.0 container
docker pull mysql:8.0; \
docker run --name ems-mysql -e MYSQL_ROOT_PASSWORD=your_root_password -e MYSQL_DATABASE=ems_lab -e MYSQL_USER=ems_user -e MYSQL_PASSWORD=ems_password -p 3306:3306 -d mysql:8.0
```

2) Initialize the database schema

Copy the SQL scripts from the `database/` folder into the container or run them against your MySQL instance. Example using Docker:
```powershell
docker cp .\database\1_create_tables_mysql.sql ems-mysql:/tmp/; \
docker exec -it ems-mysql bash -c "mysql -uems_user -pems_password ems_lab < /tmp/1_create_tables_mysql.sql"
```

3) Configure backend connection string

Edit the backend configuration file at `Backend/Group8.LabEms.Api/Group8.LabEms.Api/Configurations/appsettings.json` or copy `appsettings.example.json` and update the `ConnectionStrings` and `EmailSettings` values.

4) Run the backend API

PowerShell:
```powershell
cd .\Backend\Group8.LabEms.Api\Group8.LabEms.Api; \
dotnet run
```

By default the API will run on the configured ASP.NET Core port. Swagger UI is available in Development at `/swagger` (e.g., https://localhost:5001/swagger).

5) Run the frontend dev server

PowerShell:
```powershell
cd .\frontend; \
npm install; \
npm run dev
```

The frontend is configured to run on `http://localhost:5173` (Vite default). The backend CORS policy allows this origin by default in development.

## Configuration
Main configuration file: `Backend/Group8.LabEms.Api/Group8.LabEms.Api/Configurations/appsettings.json` (copy from `appsettings.example.json` if needed).

Important keys:
- `ConnectionStrings:DefaultConnection` — database connection string for development
- `ConnectionStrings:ProductionConnection` — connection string for production
- `EmailSettings` — SMTP parameters used by the NotificationService

Example (values found in `appsettings.example.json`):

```json
{
	"ConnectionStrings": {
		"DefaultConnection": "server=localhost;port=3306;database=labems;user=root;password=labems12345;"
	},
	"EmailSettings": {
		"SmtpHost": "smtp.gmail.com",
		"SmtpPort": "587",
		"Username": "emslab71@gmail.com",
		"Password": "<app-password>",
		"FromEmail": "emslab71@gmail.com",
		"FromName": "LabEMS System",
		"EnableSsl": "true"
	}
}
```

## Tech stack (high level)
- Backend: .NET 8 / ASP.NET Core Web API
- ORM: Entity Framework Core (Pomelo.EntityFrameworkCore.MySql)
- Logging: Serilog (Console + File sinks)
- API docs: Swashbuckle / Swagger
- Tests: xUnit, Moq, coverlet.collector
- Frontend: Vite, vanilla JS, Lit, Chart.js
- Database: MySQL (scripts + Docker Compose guidance)

## User manual
A detailed user manual for end users and administrators is included in the 'LabEMS - User Manual'
