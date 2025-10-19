# LabEMS Developer Manual

## Table of Contents
- [Project Overview](#project-overview)
- [Backend Development](#backend-development)
- [Frontend Development](#frontend-development)
- [Database Management](#database-management)
- [Development Workflow](#development-workflow)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**LabEMS (Laboratory Equipment Management System)** is a comprehensive web-based application designed to manage laboratory equipment, bookings, maintenance schedules, and user roles.

### Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | JavaScript, Vite, Lit | ES6 Modules, 7.1.2, 3.3.1 |
| **Backend** | ASP.NET Core | .NET 8.0 |
| **Database** | MySQL | 8.0.36 |
| **Authentication** | JWT (JSON Web Tokens) | - |
| **Logging** | Serilog | 9.0.0 |
| **ORM** | Entity Framework Core | 9.0.8 |

### Key Features

- ✅ User authentication and role-based access control (RBAC)
- ✅ Equipment inventory management
- ✅ Equipment booking system with calendar view
- ✅ Maintenance scheduling and tracking
- ✅ Admin dashboard with analytics and reports
- ✅ Audit logging for compliance and tracking
- ✅ Email notifications for bookings and user creation
- ✅ RESTful API with Swagger documentation

---

## Backend Development

### 1. Architecture Overview

The backend follows a **layered architecture** pattern:

```
Controllers (API Endpoints)
        ↓
Services (Business Logic)
        ↓
Models/Repositories (Data Access)
        ↓
Database (MySQL)
```

### 2. Project Structure

```
backend/Group8.LabEms.Api/Group8.LabEms.Api/
├── Controllers/           # API endpoints
│   ├── AuthController.cs              # Authentication endpoints
│   ├── UserController.cs              # User management
│   ├── EquipmentController.cs         # Equipment operations
│   ├── BookingController.cs           # Booking operations
│   ├── MaintenanceController.cs       # Maintenance tracking
│   ├── AuditLogController.cs          # Audit logging
│   └── ...
├── Services/              # Business logic
│   ├── JwtService.cs                  # JWT token generation/validation
│   ├── PasswordService.cs             # Password hashing (BCrypt)
│   ├── NotificationService.cs         # Email notifications
│   └── ServiceExtensions.cs           # DI registration
├── Models/                # Data models
│   ├── UserModel.cs
│   ├── EquipmentModel.cs
│   ├── BookingModel.cs
│   ├── Dto/              # Data Transfer Objects
│   └── ...
├── Data/                  # Entity Framework DbContext
│   └── AppDbContext.cs
├── AuditLog/              # Audit logging middleware
├── Configurations/        # Configuration files
│   ├── appsettings.json   # Settings (DB, JWT, Email, etc.)
│   └── appsettings.example.json
├── Program.cs             # Application startup configuration
└── Logs/                  # Application logs
```

### 3. Setting Up the Backend

#### Prerequisites
- .NET 8.0 SDK installed
- Visual Studio 2022 or VS Code with C# extension
- MySQL 8.0+ server running

#### Installation Steps

1. **Navigate to backend directory**
   ```bash
   cd backend/Group8.LabEms.Api/Group8.LabEms.Api
   ```

2. **Restore NuGet packages**
   ```bash
   dotnet restore
   ```

3. **Configure appsettings.json**
   - Copy or rename `appsettings.example.json` to `appsettings.json`
   - Update configuration values:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "server=localhost;port=3306;database=ems_lab;user=ems_user;password=ems_password;"
     },
     "Jwt": {
       "SecretKey": "your-super-secret-jwt-key-that-is-at-least-32-characters-long",
       "Issuer": "LabEMS",
       "Audience": "LabEMS-Users"
     },
     "EmailSettings": {
       "SmtpHost": "smtp.gmail.com",
       "SmtpPort": "587",
       "Username": "your-email@gmail.com",
       "Password": "your-app-password",
       "FromEmail": "your-email@gmail.com",
       "FromName": "LabEMS System",
       "EnableSsl": "true"
     }
   }
   ```

4. **Run the application**
   ```bash
   dotnet run
   ```

   The API will be available at `https://localhost:5001` or `http://localhost:5000`

### 4. Key Technologies

#### Entity Framework Core
- **Version**: 9.0.8
- **Purpose**: ORM for database operations
- **Database Provider**: Pomelo.EntityFrameworkCore.MySql

```csharp
// Example usage in AppDbContext
public class AppDbContext : DbContext
{
    public DbSet<UserModel> Users { get; set; }
    public DbSet<EquipmentModel> Equipment { get; set; }
    public DbSet<BookingModel> Bookings { get; set; }
    // ...
}
```

#### JWT Authentication
- **Version**: 8.0.2 (System.IdentityModel.Tokens.Jwt)
- **Purpose**: Secure stateless authentication
- **Token Storage**: HTTP-only cookies

```csharp
// Generated in AuthController
var token = _jwtService.GenerateToken(user.UserId, user.Email, role);

// Validated in Program.cs startup
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* config */ });
```

#### Password Security
- **Library**: BCrypt.Net-Next (Version 4.0.3)
- **Purpose**: Secure password hashing and verification

```csharp
// Usage
var hashedPassword = _passwordService.HashPassword(plainPassword);
var isValid = _passwordService.VerifyPassword(plainPassword, hashedPassword);
```

#### Logging
- **Library**: Serilog (9.0.0)
- **Outputs**: Console and File (`Logs/labems_log.txt`)
- **Log Level**: Debug (development), Warning (production)

```csharp
// In Program.cs
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("Logs/labems_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

### 5. API Endpoints

#### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user info

#### User Management
- `GET /api/user` - Get all users (Admin only)
- `GET /api/user/{id}` - Get user by ID
- `POST /api/user` - Create new user
- `PUT /api/user/{id}` - Update user
- `DELETE /api/user/{id}` - Delete user

#### Equipment Management
- `GET /api/equipment` - Get all equipment
- `GET /api/equipment/{id}` - Get equipment by ID
- `POST /api/equipment` - Create equipment
- `PUT /api/equipment/{id}` - Update equipment
- `DELETE /api/equipment/{id}` - Delete equipment

#### Booking Management
- `GET /api/booking` - Get all bookings (Admin)
- `GET /api/booking/user/{userId}/upcoming` - Get user's upcoming bookings
- `POST /api/booking` - Create booking
- `PUT /api/booking/{id}` - Update booking
- `DELETE /api/booking/{id}` - Cancel booking

#### Maintenance Management
- `GET /api/maintenance` - Get all maintenance records
- `POST /api/maintenance` - Schedule maintenance
- `PUT /api/maintenance/{id}` - Update maintenance status

#### Statistics & Reports
- `GET /api/stats/aggregates` - Admin dashboard statistics
- `GET /api/stats/bookings-per-month` - Booking trends
- `GET /api/stats/equipment-usage` - Equipment usage statistics

**Full API documentation available at**: `https://localhost:5001/swagger`

### 6. Dependency Injection

Backend uses built-in ASP.NET Core dependency injection. Register services in `Program.cs`:

```csharp
// Example from ServiceExtensions.cs
public static IServiceCollection AddBusinessServices(this IServiceCollection services)
{
    services.AddScoped<JwtService>();
    services.AddScoped<PasswordService>();
    services.AddScoped<INotificationService, NotificationService>();
    return services;
}
```

### 7. Creating a New Endpoint

**Step 1**: Create or update a model
```csharp
// Models/ExampleModel.cs
public class ExampleModel
{
    public int Id { get; set; }
    public string Name { get; set; }
}
```

**Step 2**: Add to DbContext
```csharp
// Data/AppDbContext.cs
public DbSet<ExampleModel> Examples { get; set; }
```

**Step 3**: Create controller
```csharp
// Controllers/ExampleController.cs
[Route("api/[controller]")]
[ApiController]
[Authorize] // If protected
public class ExampleController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public ExampleController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var examples = await _context.Examples.ToListAsync();
        return Ok(examples);
    }
}
```

### 8. Error Handling

Use standard HTTP status codes:

```csharp
// 200 OK - Successful
return Ok(data);

// 400 Bad Request - Invalid input
return BadRequest(new { error = "Invalid input" });

// 401 Unauthorized - Not authenticated
return Unauthorized();

// 403 Forbidden - Not authorized
return Forbid();

// 404 Not Found
return NotFound();

// 500 Internal Server Error
return StatusCode(500, "Internal server error");
```

---

## Frontend Development

### 1. Architecture Overview

The frontend uses a **modular component-based architecture** with ES6 modules and Vite as the build tool.

```
HTML Entry Points (index.html, login.html, forgot_password.html)
        ↓
Main Script (script.js)
        ↓
Pages & Components (Lit, JavaScript)
        ↓
API Client (api/api.js)
        ↓
Backend API
```

### 2. Project Structure

```
frontend/
├── index.html                    # Main dashboard
├── login.html                    # Login page
├── forgot_password.html          # Password reset
├── style.css                     # Global styles
├── src/
│   ├── script.js                # Main application file
│   ├── api/
│   │   └── api.js               # API fetch wrapper & functions
│   ├── pages/                    # Page components
│   │   ├── dashboard.js         # User/Admin dashboard
│   │   ├── profile.js           # User profile
│   │   ├── bookings.js          # Booking management
│   │   ├── equipent.js          # User equipment view
│   │   ├── admin_dashboard.js   # Admin dashboard
│   │   ├── admin_equipment.js   # Admin equipment management
│   │   ├── user_management.js   # User management
│   │   ├── admin_bookings.js    # Admin booking view
│   │   ├── admin_audit.js       # Audit trail view
│   │   ├── admin_reports.js     # Reports dashboard
│   │   └── maintenance.js       # Maintenance tracking
│   ├── util/                     # Utility functions
│   │   ├── auth.js              # Authentication helpers
│   │   ├── toast.js             # Notification system
│   │   └── resize.js            # Sidebar resize handler
│   ├── helpers/
│   │   └── userDataHelper.js    # User data management
│   ├── types/                    # Type definitions (JSDoc)
│   └── vite.config.js           # Vite configuration
├── .env                          # Environment variables
├── package.json                  # Dependencies
└── public/                       # Static assets
```

### 3. Setting Up the Frontend

#### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

#### Installation Steps

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - Update `.env` file with backend API URL:
   ```properties
   VITE_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173`

5. **Build for production**
   ```bash
   npm run build
   ```
   
   Output goes to `dist/` directory

### 4. Key Technologies

#### Vite
- **Version**: 7.1.2
- **Purpose**: Fast build tool and development server
- **Config**: `vite.config.js`

```javascript
// vite.config.js - Proxy API calls to backend
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

#### Lit
- **Version**: 3.3.1
- **Purpose**: Lightweight web components library
- **Usage**: Building reusable UI components

```javascript
import { html, render } from "lit";

// Rendering HTML templates
const template = html`<h1>Hello World</h1>`;
render(template, document.getElementById('container'));
```

#### Chart.js
- **Version**: 4.5.0
- **Purpose**: Data visualization for reports and statistics

```javascript
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: { /* ... */ }
});
```

### 5. Component Structure

#### Page Component Example

```javascript
// src/pages/dashboard.js
export function renderDashboard() {
  const container = document.getElementById('dashboard');
  
  // Fetch data
  const data = await apiFetch('GET', '/api/stats');
  
  // Render component
  const template = html`
    <h2>Dashboard</h2>
    <div class="stats">
      ${data.map(stat => html`<div>${stat.label}: ${stat.value}</div>`)}
    </div>
  `;
  
  render(template, container);
}
```

### 6. API Communication

#### API Fetch Wrapper

```javascript
// src/api/api.js
/**
 * @param {'GET'|'POST'|'PUT'|'PATCH'|'DELETE'} method
 * @param {string} endpoint
 * @param {object} options - { body, headers, creds, responseType }
 * @returns {Promise<any>}
 */
export async function apiFetch(method, endpoint, options = {}) {
  // Implementation handles:
  // - Request body serialization
  // - Error handling
  // - Response parsing
}
```

#### Usage Examples

```javascript
// GET request
const users = await apiFetch('GET', '/api/user');

// POST with body
const newBooking = await apiFetch('POST', '/api/booking', {
  body: { equipmentId: 1, fromDate: '2025-01-01', toDate: '2025-01-02' }
});

// PUT request
await apiFetch('PUT', '/api/equipment/5', {
  body: { name: 'Updated Name', status: 'Available' }
});

// DELETE request
await apiFetch('DELETE', '/api/booking/123');
```

### 7. Authentication & Authorization

#### User Data Helper

```javascript
// src/helpers/userDataHelper.js
import { loadUserData, checkAuthentication, handleLogout } from './helpers/userDataHelper.js';

// Load user info
const user = loadUserData(); // Returns { userId, role, name, email }

// Check if authenticated
if (!checkAuthentication()) {
  window.location.href = 'login.html';
}

// Get current user anywhere
const currentUser = getCurrentUser();

// Check permissions
if (!hasRole('Admin')) {
  // Show error
}

// Logout
handleLogout();
```

#### Role-Based Access

```javascript
// src/script.js
const TABS_BY_ROLE = {
  Student: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'equipment', label: 'Equipment' },
    { id: 'bookings', label: 'Bookings' }
  ],
  Admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'userManagement', label: 'User Management' },
    { id: 'admin-equipment', label: 'Equipment Management' },
    // ... more admin tabs
  ]
};
```

### 8. Styling

#### Global Styles

```css
/* style.css - Main stylesheet */
- Colors and themes
- Layout and responsive design
- Component styles
- Typography
```

#### CSS Custom Properties (Variables)

```css
:root {
  --primary-color: #7A4EB0;
  --secondary-color: #8d5fc5;
  --danger-color: #dc3545;
  --success-color: #28a745;
}
```

### 9. Creating a New Page

1. **Create page file** in `src/pages/`

```javascript
// src/pages/newpage.js
import { html, render } from "lit";
import { apiFetch } from "../api/api.js";

export async function renderNewPage() {
  const container = document.getElementById('newpage');
  
  try {
    const data = await apiFetch('GET', '/api/newpage');
    
    const template = html`
      <h2>New Page</h2>
      <div class="content">
        ${data.map(item => html`<p>${item.name}</p>`)}
      </div>
    `;
    
    render(template, container);
  } catch (error) {
    console.error('Error rendering page:', error);
  }
}
```

2. **Add to router** in `src/script.js`

```javascript
import { renderNewPage } from "./pages/newpage.js";

// Add to tabRenderers
const tabRenderers = {
  newpage: renderNewPage,
  // ... other renderers
};

// Add to TABS_BY_ROLE
const TABS_BY_ROLE = {
  Student: [
    // ... existing tabs
    { id: 'newpage', label: 'New Page' }
  ]
};
```

### 10. Environment Variables

```properties
# .env
VITE_API_URL=http://localhost:5000  # Backend API URL
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## Database Management

### 1. Database Schema Overview

The database uses a **normalized relational schema** with proper foreign key relationships and referential integrity.

### 2. Database Structure

```
Nominal Tables (Reference Data)
├── equipment_status
├── equipment_type
├── booking_status
├── maintenance_type
└── maintenance_status

Core Tables
├── user
├── role
├── user_role
├── equipment
├── booking
├── maintenance
└── audit_log
```

### 3. Setting Up the Database

#### Prerequisites
- MySQL 8.0+ or MySQL Docker container
- Flyway CLI (for migrations) - optional

#### Option A: Local MySQL Installation

1. **Create database**
   ```sql
   CREATE DATABASE labems;
   USE labems;
   ```

2. **Create user**
   ```sql
   CREATE USER 'labems_user'@'localhost' IDENTIFIED BY 'labems_password';
   GRANT ALL PRIVILEGES ON labems.* TO 'labems_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Run migration scripts**
   ```bash
   mysql -u labems_user -p labems < database/V001__create.sql
   mysql -u labems_user -p labems < database/V002__populate.sql
   ```

#### Option B: Docker MySQL Container

1. **Pull MySQL image**
   ```bash
   docker pull mysql:8.0
   ```

2. **Run container**
   ```bash
   docker run --name ems-mysql \
     -e MYSQL_ROOT_PASSWORD=rootpass \
     -e MYSQL_DATABASE=labems \
     -e MYSQL_USER=labems_user \
     -e MYSQL_PASSWORD=labems_password \
     -p 3306:3306 \
     -d mysql:8.0
   ```

3. **Verify running**
   ```bash
   docker ps | grep ems-mysql
   ```

4. **Execute migrations**
   ```bash
   docker cp database/V001__create.sql ems-mysql:/tmp/
   docker exec ems-mysql mysql -uroot -prootpass labems < /tmp/V001__create.sql
   ```

### 4. Database Tables

#### `user` Table
Stores user account information and authentication credentials.

```sql
CREATE TABLE `user` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `sso_id` VARCHAR(255) NOT NULL UNIQUE,
    `display_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,  -- BCrypt hashed
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `role` Table
Defines system roles for authorization.

```sql
CREATE TABLE `role` (
    `role_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL UNIQUE
);
```

#### `equipment` Table
Stores laboratory equipment information.

```sql
CREATE TABLE `equipment` (
    `equipment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `equipment_type_id` INT NOT NULL,
    `equipment_status_id` INT NOT NULL,
    `location` VARCHAR(255),
    `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`equipment_type_id`) REFERENCES `equipment_type`(`equipment_type_id`),
    FOREIGN KEY (`equipment_status_id`) REFERENCES `equipment_status`(`equipment_status_id`)
);
```

#### `booking` Table
Tracks equipment reservations.

```sql
CREATE TABLE `booking` (
    `booking_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `equipment_id` INT NOT NULL,
    `from_date` TIMESTAMP NOT NULL,
    `to_date` TIMESTAMP NOT NULL,
    `booking_status_id` INT NOT NULL,
    `notes` TEXT,
    `created_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT,
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`),
    FOREIGN KEY (`booking_status_id`) REFERENCES `booking_status`(`booking_status_id`)
);
```

#### `maintenance` Table
Logs equipment maintenance schedules and history.

```sql
CREATE TABLE `maintenance` (
    `maintenance_id` INT AUTO_INCREMENT PRIMARY KEY,
    `equipment_id` INT NOT NULL,
    `maintenance_type_id` INT NOT NULL,
    `maintenance_status_id` INT NOT NULL,
    `scheduled_for` TIMESTAMP NOT NULL,
    `started_at` TIMESTAMP NULL,
    `completed_at` TIMESTAMP NULL,
    FOREIGN KEY (`equipment_id`) REFERENCES `equipment`(`equipment_id`),
    FOREIGN KEY (`maintenance_type_id`) REFERENCES `maintenance_type`(`maintenance_type_id`),
    FOREIGN KEY (`maintenance_status_id`) REFERENCES `maintenance_status`(`maintenance_status_id`)
);
```

#### `audit_log` Table
Records system activities for compliance and debugging.

```sql
CREATE TABLE `audit_log` (
    `auditlog_id` INT AUTO_INCREMENT PRIMARY KEY,
    `timestamp` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `user_id` INT,
    `action` VARCHAR(255),
    `entity_type` VARCHAR(100),
    `entity_id` INT,
    `old_values` JSON,
    `new_values` JSON
);
```

### 5. Flyway Migrations

Flyway automatically manages database schema versions.

#### Configuration

```properties
# database/flyway.conf
flyway.url=jdbc:mysql://localhost:3306/labems
flyway.user=labems_user
flyway.password=labems_password
flyway.locations=filesystem:.
```

#### Migration Naming Convention

- **V001__create.sql** - Create initial schema
- **V002__populate.sql** - Insert seed data
- **V003__add_column.sql** - Add new column
- **V004__create_index.sql** - Add indexes

Format: `V[version]__[description].sql`

#### Running Migrations

```bash
cd database
flyway -configFiles=flyway.conf migrate
```

### 6. Database Connections in Code

#### Backend (Entity Framework)

```csharp
// Program.cs
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        _connectionString,
        new MySqlServerVersion(new Version(8, 0, 36))
    ));
```

#### Connection String Format

```
server=localhost;port=3306;database=labems;user=labems_user;password=labems_password;
```

### 7. Database Best Practices

✅ **Do:**
- Use prepared statements (EF Core handles this)
- Add indexes to frequently queried columns
- Normalize data to reduce redundancy
- Use foreign key constraints
- Regular backups

❌ **Don't:**
- Store sensitive data in plain text
- Use dynamic SQL queries
- Ignore referential integrity
- Delete historical data without archiving
- Run migrations without testing

### 8. Backing Up Database

#### MySQL Backup

```bash
# Backup entire database
mysqldump -u labems_user -p labems > backup.sql

# Backup specific table
mysqldump -u labems_user -p labems booking > booking_backup.sql

# Restore from backup
mysql -u labems_user -p labems < backup.sql
```

#### Docker Backup

```bash
# Backup from Docker container
docker exec ems-mysql mysqldump -uroot -prootpass labems > backup.sql

# Restore to Docker container
docker exec -i ems-mysql mysql -uroot -prootpass labems < backup.sql
```

---

## Development Workflow

### 1. Local Development Setup

#### Complete Setup Script

```bash
# Backend
cd backend/Group8.LabEms.Api/Group8.LabEms.Api
dotnet restore
dotnet run  # Runs on http://localhost:5000

# Frontend (in new terminal)
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173

# Database (if using Docker)
docker run --name ems-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=labems \
  -e MYSQL_USER=labems_user \
  -e MYSQL_PASSWORD=labems_password \
  -p 3306:3306 \
  -d mysql:8.0
```

### 2. Code Organization Guidelines

#### Backend Code Style

- **Naming**: PascalCase for classes, camelCase for variables
- **Files**: One class per file
- **Comments**: XML documentation for public methods
- **Error Handling**: Always handle exceptions, log errors

```csharp
/// <summary>
/// Gets a user by their ID
/// </summary>
/// <param name="id">The user ID</param>
/// <returns>The user if found, null otherwise</returns>
public async Task<UserModel> GetUserById(int id)
{
    try
    {
        return await _context.Users.FindAsync(id);
    }
    catch (Exception ex)
    {
        Log.Error(ex, $"Error fetching user {id}");
        throw;
    }
}
```

#### Frontend Code Style

- **Naming**: camelCase for functions, PascalCase for components
- **Async**: Use async/await, avoid callbacks
- **Comments**: JSDoc for public functions
- **Error Handling**: Try/catch blocks, user-friendly error messages

```javascript
/**
 * Fetches user bookings from the API
 * @async
 * @param {number} userId - The user ID
 * @returns {Promise<Array>} Array of booking objects
 * @throws {Error} If the API request fails
 */
export async function fetchUserBookings(userId) {
  try {
    const bookings = await apiFetch('GET', `/api/booking/user/${userId}/upcoming`);
    return bookings;
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    addToast('Error', 'Failed to load bookings');
    throw error;
  }
}
```

### 3. Git Workflow

#### Branch Naming Convention

- **Features**: `feature/feature-name`
- **Bugfixes**: `bugfix/bug-description`
- **Hotfixes**: `hotfix/issue-name`
- **Development**: `develop`
- **Production**: `main`

#### Commit Message Format

```
[TYPE] Brief description

Optional detailed explanation of changes.

- List of specific changes
- Another change
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
```
feat: Add equipment booking notification emails

fix: Resolve JWT token validation timeout issue

docs: Update API endpoint documentation

refactor: Extract API client logic to separate module
```

### 4. Testing

#### Backend Unit Tests

```bash
cd backend/Group8.LabEms.Test
dotnet test

# Run specific test
dotnet test --filter="TestClassName.TestMethodName"

# With coverage
dotnet test /p:CollectCoverage=true
```

#### Frontend Testing (When Implemented)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### 5. Code Review Checklist

Before submitting a pull request:

✅ Code follows style guidelines  
✅ All tests pass  
✅ No hardcoded credentials or secrets  
✅ Comments and documentation updated  
✅ No console.log() or Debug.WriteLine() left in code  
✅ Error handling implemented  
✅ Database migrations created if needed  

---

## API Documentation

### 1. Available Endpoints

Full documentation available at: **`https://localhost:5001/swagger`** (Swagger UI)

### 2. Common Response Formats

#### Success Response (200 OK)

```json
{
  "data": { /* ... */ },
  "message": "Operation successful",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

#### Error Response

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### 3. Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <jwt_token>
```

Or in HTTP-only cookie:
```
Cookie: jwt=<jwt_token>
```

### 4. Common Query Parameters

```
?page=1&pageSize=10&sortBy=createdDate&sortOrder=desc&search=keyword
```

### 5. Rate Limiting

Currently not implemented. Should be added for production:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1234567890
```

---

## Testing

### 1. Backend Testing

#### Test Structure

```
backend/Group8.LabEms.Test/
├── ControllerTests/
│   ├── AuthControllerTests.cs
│   ├── UserControllerTests.cs
│   └── ...
├── ServiceTests/
│   ├── JwtServiceTests.cs
│   ├── PasswordServiceTests.cs
│   └── ...
└── Integration/
    ├── DatabaseTests.cs
    └── ...
```

#### Running Tests

```bash
cd backend/Group8.LabEms.Test

# Run all tests
dotnet test

# Run specific class
dotnet test --filter "FullyQualifiedName~AuthControllerTests"

# Verbose output
dotnet test -v n

# With coverage report
dotnet test /p:CollectCoverage=true /p:CoverageFormat=opencover
```

#### Example Test

```csharp
[TestClass]
public class UserControllerTests
{
    private Mock<AppDbContext> _mockContext;
    private UserController _controller;
    
    [TestInitialize]
    public void Setup()
    {
        _mockContext = new Mock<AppDbContext>();
        _controller = new UserController(_mockContext.Object);
    }
    
    [TestMethod]
    public async Task GetUser_WithValidId_ReturnsOkResult()
    {
        // Arrange
        var userId = 1;
        var expectedUser = new UserModel { UserId = userId, DisplayName = "Test User" };
        
        // Act
        var result = await _controller.GetUser(userId);
        
        // Assert
        Assert.IsNotNull(result);
    }
}
```

### 2. Frontend Testing

#### Suggested Testing Tools

- **Unit Testing**: Vitest or Jest
- **Component Testing**: Lit's test utilities
- **E2E Testing**: Cypress or Playwright

#### Test Commands (When Implemented)

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

---

## Troubleshooting

### Common Issues and Solutions

#### Backend Issues

##### 1. Connection String Errors

**Error**: `Cannot connect to database`

**Solution**:
```bash
# Verify MySQL is running
docker ps | grep mysql

# Test connection
mysql -h localhost -u labems_user -p labems

# Update appsettings.json with correct credentials
```

##### 2. JWT Token Validation Fails

**Error**: `Unable to validate token`

**Solution**:
```csharp
// Check JWT secret key in appsettings.json
// Ensure it's at least 32 characters long
// Restart the application after config changes
```

##### 3. CORS Errors

**Error**: `Access-Control-Allow-Origin` header missing

**Solution**:
```csharp
// Already configured in Program.cs for http://localhost:5173
// For production, update allowed origins:
policy.WithOrigins("https://yourdomain.com")
```

#### Frontend Issues

##### 1. API Calls Failing

**Error**: `Failed to fetch: TypeError`

**Solution**:
```javascript
// Verify backend URL in .env
VITE_API_URL=http://localhost:5000

// Check backend is running
// Verify CORS is enabled
// Check browser console for detailed error
```

##### 2. Page Not Rendering

**Error**: `Element not found`

**Solution**:
```javascript
// Verify HTML has target element with correct ID
// Check page is registered in TABS_BY_ROLE
// Verify page render function is imported and called
```

##### 3. localStorage Issues

**Error**: `localStorage undefined or quota exceeded`

**Solution**:
```javascript
// In private/incognito mode, localStorage may be unavailable
// Check browser console for quota errors
// Clear browser cache and cookies if quota exceeded
```

#### Database Issues

##### 1. Migration Fails

**Error**: `Migration V001__create.sql failed`

**Solution**:
```bash
# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check migration file syntax
# Verify Flyway configuration
# Check file encoding (should be UTF-8)
```

##### 2. Foreign Key Constraint Error

**Error**: `Cannot add or update a child row`

**Solution**:
```sql
-- Temporarily disable foreign key checks
SET FOREIGN_KEY_CHECKS=0;

-- Your operation

-- Re-enable
SET FOREIGN_KEY_CHECKS=1;

-- Or fix the data to satisfy constraints
```

### Getting Help

1. **Check logs**:
   - Backend: `backend/Group8.LabEms.Api/Group8.LabEms.Api/Logs/labems_log.txt`
   - Frontend: Browser DevTools Console (F12)

2. **Enable debug logging**:
   ```csharp
   // In appsettings.json
   "Logging": {
     "LogLevel": {
       "Default": "Debug"
     }
   }
   ```

3. **Contact the development team** with:
   - Exact error message
   - Steps to reproduce
   - Relevant logs
   - Environment details (OS, versions)

---

## Additional Resources

### Documentation Files
- **System Architecture**: `/documents/Diagrams/2_High_Level_Architecture.png`
- **Database ERD**: `/documents/Diagrams/5_Data_Architecture_ERD.drawio`
- **UI Decomposition**: `/documents/Diagrams/3_UI_Layer_Decomposition.png`

### External Resources
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/)
- [Entity Framework Core](https://docs.microsoft.com/ef/core/)
- [Vite Documentation](https://vitejs.dev/)
- [Lit Documentation](https://lit.dev/)
- [JWT.io](https://jwt.io/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### Team Contact
- Technical Lead: [Contact info]
- Database Administrator: [Contact info]
- DevOps: [Contact info]

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Maintainer**: LabEMS Development Team
