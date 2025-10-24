# LabEMS Developer Manual

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Development Environment Setup](#development-environment-setup)
4. [Project Structure](#project-structure)
5. [Backend Development](#backend-development)
6. [Frontend Development](#frontend-development)
7. [Database Management](#database-management)
8. [API Documentation](#api-documentation)
9. [Security](#security)
10. [Configuration Management](#configuration-management)
11. [Testing](#testing)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Deployment](#deployment)
14. [Contributing Guidelines](#contributing-guidelines)

## Project Overview

A complete web-based tool called LabEMS (Lab Equipment Management System) was created to manage laboratory equipment, reservations, and maintenance plans. The system offers audit recording, role-based access control, and extensive reporting features.

### Key Features
- Equipment inventory management
- Equipment booking system with conflict resolution
- Maintenance scheduling and tracking
- User management with role-based access control
- Comprehensive audit logging
- Real-time statistics and reporting
- Email notifications
- PDF report generation

### Technology Stack
- **Backend**: ASP.NET Core 8.0 Web API
- **Frontend**: JavaScript with Lit components and Vite
- **Database**: MySQL
- **Authentication**: JWT Bearer tokens
- **Logging**: Serilog
- **PDF Generation**: QuestPDF
- **Charts**: Chart.js

## Architecture

### System Architecture
The application follows a layered architecture pattern:

```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │
│   (JavaScript)  │◄──►│   (.NET Core)   │
└─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐
                       │   MySQL DB      │
                       └─────────────────┘
```

### Backend Architecture Layers
1. **Controllers**: Handle the HTTP requests and responses
2. **Services**: HHandels business logic implementation
3. **Data Layer**: Entity Framework Core with DbContext
4. **Models**: Data transfer objects and entity models
5. **Middleware**: Cross-cutting concerns (audit logging, CORS)

### Frontend Architecture
1. **API Layer**: Handles all the backend communication
2. **Pages**: Individual page components, using Lit
3. **Utilities**: Helper functions for DOM manipulation, auth, and other utilities
4. **Types**: TypeScript type definitions

## Development Environment Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js 16+ (recommended: 18+)
- MySQL 8.0+
- Git
- Visual Studio Code or Visual Studio 2022
- MySQL Workbench (for database management, optional)

### Environment Setup Steps

1. **Clone the Repository**
   ```powershell
   git clone https://github.com/Group8LabEMS/Cmpg323_Group8_EmsLab.git
   cd Cmpg323_Group8_EmsLab
   ```

2. **Database Setup**
   ```sql
   -- Create database
   CREATE DATABASE labems_db;
   ```

3. **Backend Configuration**
   ```powershell
   cd Backend\Group8.LabEms.Api\Group8.LabEms.Api\Configurations
   copy appsettings.example.json appsettings.json
   copy database.example.json database.json
   ```
   
   Edit `appsettings.json` and `database.json` with your configuration.

4. **Run All Database Migrations**
   ```powershell
   cd database
   # Using Flyway or manual SQL execution
   mysql -u username -p labems_db < V001__create.sql
   mysql -u username -p labems_db < V002__populate.sql
   ```

5. **Backend Setup**
   ```powershell
   cd Backend\Group8.LabEms.Api\Group8.LabEms.Api
   dotnet restore
   dotnet build
   dotnet run
   ```

6. **Frontend Setup**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```

### Development Tools Configuration

#### Visual Studio Code Extensions
- C# Dev Kit
- Debugger for java
- .NET Install Tool
- Lit-plugin
- REST Client
- MySQL

#### Environment Variables
Create a `.env` file within the frontend directory:
```env
VITE_API_BASE_URL=https://localhost:7000
```

## Project Structure

```
Cmpg323_Group8_EmsLab/
├── Backend/
│   └── Group8.LabEms.Api/
│       └── Group8.LabEms.Api/
│           ├── Controllers/          # API controllers
│           ├── Models/              # Data models and DTOs
│           ├── Services/            # Business logic services
│           ├── Data/                # Entity Framework DbContext
│           ├── Middleware/          # Custom middleware
│           ├── AuditLog/           # Audit logging components
│           ├── BusinessLogic/      # Core business logic
│           ├── Configurations/     # Configuration files
│           └── wwwroot/           # Static files
├── frontend/
│   ├── src/
│   │   ├── api/                   # API communication layer
│   │   ├── pages/                 # Page components
│   │   ├── util/                  # Utility functions
│   │   └── types/                 # TypeScript definitions
│   ├── public/                    # Static assets
│   └── package.json
├── database/
│   ├── V001__create.sql          # Database schema
│   └── V002__populate.sql        # Initial data
├── documents/
│   ├── Diagrams/                 # System diagrams
│   └── stories/                  # User stories and requirements
└── Backend/Group8.LabEms.Test/   # Unit tests
```

## Backend Development

### Key Components

#### Controllers
Located in `/Backend/Group8.LabEms.Api/Group8.LabEms.Api/Controllers/`

- **AuthController**: Authentication and authorization
- **EquipmentController**: Equipment management
- **BookingController**: Bookings management
- **MaintenanceController**: Maintenance scheduling
- **UserController**: User management
- **StatsController**: Reporting
- **AuditLogController**: Audit trail management

#### Services
Located in `/Backend/Group8.LabEms.Api/Group8.LabEms.Api/Services/`

Services handle all the business logic and are placed into the controllers:
- **EmailService**: Handels all email notifications
- **NotificationService**: Handels all system notifications
- **ReportService**: Handels the PDF report generation

#### Data Models
Located in `/Backend/Group8.LabEms.Api/Group8.LabEms.Api/Models/`

Key models include:
- **UserModel**: User entity and data transfer objects (DTOs)
- **EquipmentModel**: Equipment entity and data transfer objects (DTOs)
- **BookingModel**: Booking entity and data transfer objects (DTOs)
- **MaintenanceModel**: Maintenance entity and data transfer objects (DTOs)
- **AuditLogModel**: Audit logging entity

### Authentication & Authorization

The system makes use of JWT Bearer tokens for authentication of the users as shown below:

```csharp
// JWT configuration in Program.cs
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["SecretKey"]))
        };
    });
```

### Database Context

Entity Framework Core is used for all the database operations as shown below:

```csharp
public class AppDbContext : DbContext
{
    public DbSet<UserModel> Users { get; set; }
    public DbSet<EquipmentModel> Equipment { get; set; }
    public DbSet<BookingModel> Bookings { get; set; }
    // ... other entities
}
```

### Logging

Serilog is setup for all logging as hown below:

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("Logs/labems_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

### Adding New API Endpoints

1. **Create/Update Model** (if nessisary)
   ```csharp
   public class NewEntityModel
   {
       public int Id { get; set; }
       public string Name { get; set; }
       // ... other properties
   }
   ```

2. **Update DbContext**
   ```csharp
   public DbSet<NewEntityModel> NewEntities { get; set; }
   ```

3. **Create Controller**
   ```csharp
   [ApiController]
   [Route("api/[controller]")]
   public class NewEntityController : ControllerBase
   {
       private readonly AppDbContext _context;
       
       public NewEntityController(AppDbContext context)
       {
           _context = context;
       }
       
       [HttpGet]
       public async Task<ActionResult<IEnumerable<NewEntityModel>>> GetAll()
       {
           return await _context.NewEntities.ToListAsync();
       }
   }
   ```

## Frontend Development

### Project Structure

The frontend makes use of modern JavaScript with Lit web components:

```
frontend/src/
├── api/
│   └── api.js              # API communication layer
├── pages/
│   ├── admin_*.js          # Admin-specific pages
│   ├── dashboard.js        # Main dashboard
│   ├── bookings.js         # Booking management
│   └── equipment.js        # Equipment management
├── util/
│   ├── auth.js             # Authentication utilities
│   ├── dom.js              # DOM manipulation helpers
│   ├── modals.js           # Modal utilities
│   └── toast.js            # Notification system
└── types/
    └── global.d.ts         # TypeScript definitions
```

### API Communication

All the API calls go through the centralized API layer in `src/api/api.js`:

```javascript
class ApiClient {
    constructor() {
        this.baseURL = 'https://localhost:7000';
        this.token = localStorage.getItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            },
            ...options
        };
        
        const response = await fetch(url, config);
        return this.handleResponse(response);
    }
}
```

### Lit Components

Page components are built by makeing use of Lit:

```javascript
import { LitElement, html, css } from 'lit';

class DashboardPage extends LitElement {
    static styles = css`
        :host {
            display: block;
            padding: 20px;
        }
    `;

    render() {
        return html`
            <div class="dashboard">
                <h1>Dashboard</h1>
                <!-- Component content -->
            </div>
        `;
    }
}

customElements.define('dashboard-page', DashboardPage);
```

### State Management

The application uses a simple way to maintain states by makeing use of a state management pattern:

```javascript
// util/auth.js
export class AuthState {
    static currentUser = null;
    static isAuthenticated = false;
    
    static login(user, token) {
        this.currentUser = user;
        this.isAuthenticated = true;
        localStorage.setItem('authToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user));
    }
    
    static logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
    }
}
```

### Adding New Frontend Pages

1. **Create Page Component**
   ```javascript
   // src/pages/new-page.js
   import { LitElement, html, css } from 'lit';
   
   class NewPage extends LitElement {
       static styles = css`
           /* Page styles */
       `;
       
       render() {
           return html`<div>New Page Content</div>`;
       }
   }
   
   customElements.define('new-page', NewPage);
   ```

2. **Update Routing**
   ```javascript
   // src/script.js
   function route() {
       switch(page) {
           case 'new-page':
               import('./pages/new-page.js');
               break;
       }
   }
   ```

## Database Management

### Schema Structure

The database consists of a few important tables namely:

- **Users & Roles**: User management and role-based access
- **Equipment**: Equipment inventory and status tracking
- **Bookings**: Equipment reservation system
- **Maintenance**: Maintenance scheduling and tracking
- **Audit Logs**: System activity logging

### Migration Management

All the database migrations are managed using SQL scripts in the `database/` folder:

- `V001__create.sql`: Initial schema creation
- `V002__populate.sql`: Initial data population

### Key Relationships

```sql
-- Equipment belongs to types and has status
Equipment -> EquipmentType (FK)
Equipment -> EquipmentStatus (FK)

-- Bookings link users to equipment
Booking -> User (FK)
Booking -> Equipment (FK)
Booking -> BookingStatus (FK)

-- Maintenance tracking
Maintenance -> Equipment (FK)
Maintenance -> MaintenanceType (FK)
Maintenance -> MaintenanceStatus (FK)
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User authentication |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/refresh` | Token refresh |

### Equipment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Get all equipment |
| GET | `/api/equipment/{id}` | Get equipment by ID |
| POST | `/api/equipment` | Create new equipment |
| PUT | `/api/equipment/{id}` | Update equipment |
| DELETE | `/api/equipment/{id}` | Delete equipment |

### Booking Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/booking` | Get all bookings |
| GET | `/api/booking/user/{userId}` | Get user bookings |
| POST | `/api/booking` | Create new booking |
| PUT | `/api/booking/{id}` | Update booking |
| DELETE | `/api/booking/{id}` | Cancel booking |

### Request/Response Examples

#### Create a Equipment item
```json
POST /api/equipment
{
    "name": "Microscope XYZ",
    "description": "High-resolution microscope",
    "serialNumber": "MIC-2024-001",
    "equipmentTypeId": 1,
    "equipmentStatusId": 1
}
```

#### Create a Booking
```json
POST /api/booking
{
    "equipmentId": 1,
    "startDate": "2024-01-15T09:00:00Z",
    "endDate": "2024-01-15T17:00:00Z",
    "purpose": "Research project"
}
```

## Security

### Authentication and Authorization

#### JWT Token Management
- Token expiration: 60 minutes (can be configured to users needs)
- Refresh token rotation
- Secure token storage practices

```csharp
// Token validation configuration
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero // Reduce clock skew tolerance
        };
    });
```

#### Role-Based Access Control (RBAC)
- **Admin**: Has full admin pages access
- **Student**: Has access to all equipment booking and viewing and user pages

#### Security Headers
```csharp
// Security headers middleware
app.UseHsts();
app.UseHttpsRedirection();
app.UseXContentTypeOptions();
app.UseReferrerPolicy(ReferrerPolicyOptions.NoReferrer);
app.UseXXssProtection(options => options.EnabledWithBlockMode());
app.UseXfo(options => options.Deny());
```

### Input Validation and Sanitization

#### Model Validation
```csharp
public class BookingCreateDto
{
    [Required]
    [Range(1, int.MaxValue)]
    public int EquipmentId { get; set; }
    
    [Required]
    [DataType(DataType.DateTime)]
    public DateTime StartDate { get; set; }
    
    [Required]
    [DataType(DataType.DateTime)]
    public DateTime EndDate { get; set; }
    
    [StringLength(500)]
    public string Purpose { get; set; }
}
```

#### SQL Injection Prevention
- Make use of parameterized queries
- Entity Framework Core parameter binding
- Input validation at API level

### Password Security
- BCrypt hashing implemented

### Cross orgin resource shareing (CORS) Configuration
```csharp
services.AddCors(options =>
{
    options.AddPolicy("Production", builder =>
    {
        builder
            .WithOrigins("https://yourdomain.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

## Configuration Management

### Environment-Specific Configuration

#### Development Configuration
```json
{
    "Database": {
        "ConnectionString": "Server=localhost;Database=labems_dev;Uid=dev_user;Pwd=dev_password;"
    },
    "Jwt": {
        "SecretKey": "development-secret-key-min-256-bits",
        "Issuer": "LabEMS-Dev",
        "Audience": "LabEMS-Users",
        "ExpiryMinutes": 60
    },
    "Email": {
        "SmtpServer": "localhost",
        "Port": 1025,
        "UseSsl": false
    }
}
```

#### Production Configuration
```json
{
    "Database": {
        "ConnectionString": "${DATABASE_CONNECTION_STRING}"
    },
    "Jwt": {
        "SecretKey": "${JWT_SECRET_KEY}",
        "Issuer": "LabEMS-Prod",
        "Audience": "LabEMS-Users",
        "ExpiryMinutes": 30
    },
    "Email": {
        "SmtpServer": "${SMTP_SERVER}",
        "Port": 587,
        "UseSsl": true,
        "Username": "${SMTP_USERNAME}",
        "Password": "${SMTP_PASSWORD}"
    }
}
```

### Environment Variables

All required environment variables for production:
```bash
DATABASE_CONNECTION_STRING=Server=prod-db;Database=labems;Uid=app_user;Pwd=secure_password;
JWT_SECRET_KEY=your-super-secure-256-bit-secret-key-here
SMTP_SERVER=smtp.yourdomain.com
SMTP_USERNAME=noreply@yourdomain.com
SMTP_PASSWORD=your-smtp-password
ASPNETCORE_ENVIRONMENT=Production
```

### Configuration Validation
```csharp
public class DatabaseOptions
{
    public const string SectionName = "Database";
    
    [Required]
    public string ConnectionString { get; set; }
    
    [Range(1, 3600)]
    public int CommandTimeout { get; set; } = 30;
}

// Validate configuration on startup
services.AddOptions<DatabaseOptions>()
    .Bind(configuration.GetSection(DatabaseOptions.SectionName))
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

## Testing

### Backend Testing

All unit tests are located in `/Backend/Group8.LabEms.Test/`

Run tests:
```powershell
cd Backend\Group8.LabEms.Test
dotnet test
```

### Test Categories

1. **Service Tests**: Business logic validation
2. **Controller Tests**: API endpoint testing
3. **Integration Tests**: End-to-end functionality

### Example Test Structure

```csharp
[TestClass]
public class NotificationServiceTests
{
    private NotificationService _service;
    
    [TestInitialize]
    public void Setup()
    {
        _service = new NotificationService();
    }
    
    [TestMethod]
    public async Task SendNotification_ValidInput_ReturnsSuccess()
    {
        // Arrange
        var notification = new NotificationModel();
        
        // Act
        var result = await _service.SendNotification(notification);
        
        // Assert
        Assert.IsTrue(result.Success);
    }
}
```

## CI/CD Pipeline

### GitHub Actions Workflow

#### Backend CI/CD
```yaml
# .github/workflows/backend-ci-cd.yml
name: Backend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths: [ 'Backend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'Backend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: labems_test
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: 8.0.x
        
    - name: Restore dependencies
      run: dotnet restore Backend/Group8.LabEms.Api/Group8.LabEms.Api.sln
      
    - name: Build
      run: dotnet build Backend/Group8.LabEms.Api/Group8.LabEms.Api.sln --no-restore
      
    - name: Test
      run: dotnet test Backend/Group8.LabEms.Test/Group8.LabEms.Test.csproj --verbosity normal
      
    - name: Publish
      if: github.ref == 'refs/heads/main'
      run: dotnet publish Backend/Group8.LabEms.Api/Group8.LabEms.Api/Group8.LabEms.Api.csproj -c Release -o ./publish

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'labems-api'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './publish'
```

#### Frontend CI/CD
```yaml
# .github/workflows/frontend-ci-cd.yml
name: Frontend CI/CD

on:
  push:
    branches: [ main, develop ]
    paths: [ 'frontend/**' ]
  pull_request:
    branches: [ main ]
    paths: [ 'frontend/**' ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
        
    - name: Install dependencies
      run: npm ci
      working-directory: frontend
      
    - name: Run tests
      run: npm test
      working-directory: frontend
      
    - name: Build
      run: npm run build
      working-directory: frontend
      
    - name: Deploy to Azure Static Web Apps
      if: github.ref == 'refs/heads/main'
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        action: "upload"
        app_location: "frontend"
        output_location: "dist"
```

## Deployment

### Production Build

1. **Backend Production Build**
   ```powershell
   cd Backend\Group8.LabEms.Api\Group8.LabEms.Api
   dotnet publish -c Release -o ./publish
   ```

2. **Frontend Production Build**
   ```powershell
   cd frontend
   npm run build
   ```

### Environment Configuration

Create configuration files:
- `appsettings.json`
- `database.json`
- `flyway.conf`

## Troubleshooting

### Common Issues

#### Backend Issues

1. **Database Connection Errors**
   - Verify connection string in `database.json`
   - Ensure MySQL service is running
   - Check firewall settings

2. **JWT Token Issues**
   - Verify secret key configuration
   - Check token settings for expiration
   - Ensure that key is consistent across all instances

3. **CORS Issues**
   - Update CORS policy in `Program.cs`
   - Verify frontend URL

#### Frontend Issues

1. **API Communication Errors**
   - Check API base URL configuration
   - Verify CORS settings
   - Check network connectivity

2. **Authentication Issues**
   - Clear browser cookies
   - Check token expiration
   - Verify API endpoints

## Guidelines

### Code Standards

1. **C# Conventions**
   - Follow all the Microsoft C# coding conventions
   - Use PascalCase for public members
   - Use camelCase for private members

2. **JavaScript Conventions**
   - Use ES6+ features
   - Use proper variable names
   - Document all the complex functions

## Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Lit Documentation](https://lit.dev/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/) - JWT debugger and documentation

---

**Last Updated**: October 2025  
**Version**: 1.0  
**Maintainers**: Group 8 LabEMS Team
