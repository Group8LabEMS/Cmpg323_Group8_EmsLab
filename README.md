# LabEMS - Lab Equipment Management System

A web-based application for managing laboratory equipment, bookings, and maintenance schedules.

## Features
- Equipment inventory management
- Equipment booking system
- Maintenance scheduling and tracking
- User management with role-based access
- Audit logging

## Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js (16+ recommended)
- MySQL database

### Quick Setup

1. **Database Setup**
   - Set up a MySQL database
   - Run the database migration scripts from the `database/` folder

2. **Backend Setup**
   ```powershell
   cd Backend\Group8.LabEms.Api\Group8.LabEms.Api
   dotnet run
   ```

3. **Frontend Setup**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### Configuration
Configure your database connection and email settings in:
`Backend/Group8.LabEms.Api/Group8.LabEms.Api/Configurations/appsettings.json`

Copy from `appsettings.example.json` and update with your settings.

## Project Structure
- `Backend/` - ASP.NET Core Web API
- `frontend/` - JavaScript frontend with Vite
- `database/` - Database migration scripts
- `documents/` - Project documentation

## Technology Stack
- Backend: ASP.NET Core (.NET 8)
- Frontend: JavaScript, Vite, Lit components
- Database: MySQL
- Authentication: JWT

## Testing
Run backend tests:
```powershell
cd Backend\Group8.LabEms.Test
dotnet test
```

## Documentation
Additional documentation, user manual and developer manual can be found in the `documents/` folder.
