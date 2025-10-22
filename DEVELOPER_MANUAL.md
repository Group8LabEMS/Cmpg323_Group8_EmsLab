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
11. [Logging and Monitoring](#logging-and-monitoring)
12. [Performance Optimization](#performance-optimization)
13. [Testing](#testing)
14. [CI/CD Pipeline](#cicd-pipeline)
15. [Deployment](#deployment)
16. [Maintenance and Operations](#maintenance-and-operations)
17. [Error Handling](#error-handling)
18. [Data Migration](#data-migration)
19. [Backup and Recovery](#backup-and-recovery)
20. [Troubleshooting](#troubleshooting)
21. [Contributing Guidelines](#contributing-guidelines)
22. [Appendices](#appendices)

## Project Overview

LabEMS (Lab Equipment Management System) is a comprehensive web-based application designed for managing laboratory equipment, bookings, and maintenance schedules. The system provides role-based access control, audit logging, and comprehensive reporting capabilities.

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
1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Business logic implementation
3. **Data Layer**: Entity Framework Core with DbContext
4. **Models**: Data transfer objects and entity models
5. **Middleware**: Cross-cutting concerns (audit logging, CORS)

### Frontend Architecture
1. **API Layer**: Handles all backend communication
2. **Pages**: Individual page components using Lit
3. **Utilities**: Helper functions for DOM manipulation, auth, etc.
4. **Types**: TypeScript type definitions

## Development Environment Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js 16+ (recommended: 18+)
- MySQL 8.0+
- Git
- Visual Studio Code or Visual Studio 2022
- MySQL Workbench (optional, for database management)

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

4. **Run Database Migrations**
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
- JavaScript (ES6) code snippets
- Lit-html
- REST Client
- MySQL

#### Environment Variables
Create a `.env` file in the frontend directory:
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
- **BookingController**: Booking operations
- **MaintenanceController**: Maintenance scheduling
- **UserController**: User management
- **StatsController**: Statistics and reporting
- **AuditLogController**: Audit trail access

#### Services
Located in `/Backend/Group8.LabEms.Api/Group8.LabEms.Api/Services/`

Services handle business logic and are injected into controllers:
- **EmailService**: Email notifications
- **NotificationService**: System notifications
- **ReportService**: PDF report generation

#### Data Models
Located in `/Backend/Group8.LabEms.Api/Group8.LabEms.Api/Models/`

Key models include:
- **UserModel**: User entity and DTOs
- **EquipmentModel**: Equipment entity and DTOs
- **BookingModel**: Booking entity and DTOs
- **MaintenanceModel**: Maintenance entity and DTOs
- **AuditLogModel**: Audit logging entity

### Authentication & Authorization

The system uses JWT Bearer tokens for authentication:

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

Entity Framework Core is used for database operations:

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

Serilog is configured for comprehensive logging:

```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.Console()
    .WriteTo.File("Logs/labems_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

### Adding New API Endpoints

1. **Create/Update Model** (if needed)
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

The frontend uses modern JavaScript with Lit web components:

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

All API calls go through the centralized API layer in `src/api/api.js`:

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

Page components are built using Lit:

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

The application uses a simple state management pattern:

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

The database consists of several key tables:

- **Users & Roles**: User management and role-based access
- **Equipment**: Equipment inventory and status tracking
- **Bookings**: Equipment reservation system
- **Maintenance**: Maintenance scheduling and tracking
- **Audit Logs**: System activity logging

### Migration Management

Database migrations are managed using SQL scripts in the `database/` folder:

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

#### Create Equipment
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

#### Create Booking
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
- Token expiration: 60 minutes (configurable)
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
- **Admin**: Full system access
- **Manager**: Equipment and user management
- **User**: Equipment booking and viewing
- **Technician**: Maintenance operations

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
- Use parameterized queries
- Entity Framework Core parameter binding
- Input validation at API level

### Password Security
- BCrypt hashing with salt rounds: 12
- Password complexity requirements
- Account lockout after failed attempts

### CORS Configuration
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

Required environment variables for production:
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

## Logging and Monitoring

### Structured Logging with Serilog

#### Log Configuration
```csharp
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .MinimumLevel.Override("System", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("Application", "LabEMS")
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj} {Properties:j}{NewLine}{Exception}")
    .WriteTo.File(
        path: "Logs/labems-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {CorrelationId} {Message:lj} {Properties:j}{NewLine}{Exception}")
    .CreateLogger();
```

#### Logging Best Practices
```csharp
// Use structured logging
_logger.LogInformation("User {UserId} created booking {BookingId} for equipment {EquipmentId}", 
    userId, bookingId, equipmentId);

// Log exceptions with context
try
{
    await _bookingService.CreateBooking(booking);
}
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to create booking for user {UserId} and equipment {EquipmentId}", 
        booking.UserId, booking.EquipmentId);
    throw;
}
```

### Application Performance Monitoring

#### Health Checks
```csharp
services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>()
    .AddCheck("email_service", () => 
    {
        // Check email service connectivity
        return HealthCheckResult.Healthy();
    });

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
```

#### Metrics Collection
```csharp
// Custom metrics
services.AddSingleton<IMetrics, Metrics>();

// Usage in controllers
[HttpPost]
public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
{
    using var activity = _metrics.StartActivity("booking.create");
    activity?.SetTag("equipment.id", dto.EquipmentId.ToString());
    
    // ... booking logic
}
```

### Log Levels and Categories

| Level | Usage | Examples |
|-------|-------|----------|
| **Fatal** | Application crashes | Database unavailable, configuration errors |
| **Error** | Handled exceptions | Failed bookings, email sending failures |
| **Warning** | Recoverable issues | Deprecated API usage, performance warnings |
| **Information** | Important events | User login, booking creation, system startup |
| **Debug** | Detailed flow info | Method entry/exit, detailed state changes |
| **Trace** | Very detailed info | SQL queries, HTTP requests/responses |

## Performance Optimization

### Database Performance

#### Query Optimization
```csharp
// Use projection to reduce data transfer
public async Task<IEnumerable<EquipmentSummaryDto>> GetEquipmentSummaryAsync()
{
    return await _context.Equipment
        .Include(e => e.EquipmentType)
        .Include(e => e.EquipmentStatus)
        .Select(e => new EquipmentSummaryDto
        {
            Id = e.Id,
            Name = e.Name,
            TypeName = e.EquipmentType.Name,
            StatusName = e.EquipmentStatus.Name
        })
        .ToListAsync();
}
```

#### Connection Pooling
```csharp
services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(connectionString, serverVersion, mySqlOptions =>
    {
        mySqlOptions.EnableRetryOnFailure(
            maxRetryCount: 3,
            maxRetryDelay: TimeSpan.FromSeconds(5),
            errorNumbersToAdd: null);
    });
}, ServiceLifetime.Scoped);
```

#### Caching Strategy
```csharp
// Memory caching for reference data
services.AddMemoryCache();

// Usage
public async Task<IEnumerable<EquipmentTypeDto>> GetEquipmentTypesAsync()
{
    return await _cache.GetOrCreateAsync("equipment-types", async entry =>
    {
        entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromHours(1);
        return await _context.EquipmentTypes.ToListAsync();
    });
}
```

### API Performance

#### Response Compression
```csharp
services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});
```

#### Pagination
```csharp
public async Task<PagedResult<BookingDto>> GetBookingsAsync(int page, int pageSize)
{
    var query = _context.Bookings.AsQueryable();
    var totalCount = await query.CountAsync();
    
    var bookings = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();
    
    return new PagedResult<BookingDto>
    {
        Items = bookings,
        TotalCount = totalCount,
        Page = page,
        PageSize = pageSize
    };
}
```

### Frontend Performance

#### Bundle Optimization
```javascript
// vite.config.js
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['lit', 'chart.js'],
                    api: ['./src/api/api.js']
                }
            }
        }
    }
});
```

#### Lazy Loading
```javascript
// Dynamic imports for route-based code splitting
async function loadPage(pageName) {
    const module = await import(`./pages/${pageName}.js`);
    return module.default;
}
```

## Testing

### Backend Testing

Unit tests are located in `/Backend/Group8.LabEms.Test/`

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

### Frontend Testing

For frontend testing, you can add Jest or Vitest:

```powershell
npm install --save-dev vitest
```

#### Frontend Test Structure
```javascript
// tests/components/dashboard.test.js
import { expect, test } from 'vitest';
import { fixture, html } from '@open-wc/testing';
import '../src/pages/dashboard.js';

test('dashboard renders correctly', async () => {
    const element = await fixture(html`<dashboard-page></dashboard-page>`);
    expect(element.shadowRoot.querySelector('h1')).to.exist;
});
```

#### API Testing
```javascript
// tests/api/auth.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { ApiClient } from '../src/api/api.js';

describe('Authentication API', () => {
    let apiClient;
    
    beforeEach(() => {
        apiClient = new ApiClient();
    });
    
    it('should login with valid credentials', async () => {
        const response = await apiClient.login('test@example.com', 'password');
        expect(response.success).toBe(true);
        expect(response.token).toBeDefined();
    });
});
```

### Load Testing

#### Backend Load Testing with NBomber
```csharp
var scenario = Scenario.Create("booking_creation", async context =>
{
    var booking = new BookingCreateDto
    {
        EquipmentId = 1,
        StartDate = DateTime.Now.AddDays(1),
        EndDate = DateTime.Now.AddDays(1).AddHours(2),
        Purpose = "Load test booking"
    };
    
    var response = await httpClient.PostAsJsonAsync("/api/booking", booking);
    return response.IsSuccessStatusCode ? Response.Ok() : Response.Fail();
})
.WithLoadSimulations(
    Simulation.InjectPerSec(rate: 10, during: TimeSpan.FromMinutes(5))
);
```

### Test Data Management

#### Database Seeding for Tests
```csharp
public class TestDataSeeder
{
    public static void SeedTestData(AppDbContext context)
    {
        if (!context.Users.Any())
        {
            context.Users.AddRange(
                new UserModel { Email = "admin@test.com", Role = "Admin" },
                new UserModel { Email = "user@test.com", Role = "User" }
            );
            context.SaveChanges();
        }
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

### Quality Gates

#### Code Quality Checks
```yaml
    - name: Run ESLint
      run: npm run lint
      working-directory: frontend
      
    - name: Run Prettier
      run: npm run format:check
      working-directory: frontend
      
    - name: SonarCloud Scan
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

#### Security Scanning
```yaml
    - name: Run security audit
      run: npm audit --audit-level high
      working-directory: frontend
      
    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
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

Create production configuration files:
- `appsettings.Production.json`
- Production database connection strings
- JWT secret keys
- Email service configuration

### Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] CORS policies updated for production domains
- [ ] Logging configured for production
- [ ] Backup strategy implemented

## Troubleshooting

### Common Issues

#### Backend Issues

1. **Database Connection Errors**
   - Verify connection string in `database.json`
   - Ensure MySQL service is running
   - Check firewall settings

2. **JWT Token Issues**
   - Verify secret key configuration
   - Check token expiration settings
   - Ensure consistent key across instances

3. **CORS Issues**
   - Update CORS policy in `Program.cs`
   - Verify frontend URL in allowed origins

#### Frontend Issues

1. **API Communication Errors**
   - Check API base URL configuration
   - Verify CORS settings
   - Check network connectivity

2. **Authentication Issues**
   - Clear browser local storage
   - Check token expiration
   - Verify API endpoints

### Debug Mode

Enable debug logging:

```json
// appsettings.json
{
    "Logging": {
        "LogLevel": {
            "Default": "Debug"
        }
    }
}
```

### Performance Monitoring

Monitor application performance using:
- Serilog structured logging
- Application Insights (if configured)
- Database query performance
- Frontend performance metrics

## Contributing Guidelines

### Code Standards

1. **C# Conventions**
   - Follow Microsoft C# coding conventions
   - Use PascalCase for public members
   - Use camelCase for private members
   - Add XML documentation for public APIs

2. **JavaScript Conventions**
   - Use ES6+ features
   - Follow ESLint recommendations
   - Use meaningful variable names
   - Document complex functions

### Git Workflow

1. **Branch Naming**
   - `feature/feature-name`
   - `bugfix/bug-description`
   - `hotfix/critical-fix`

2. **Commit Messages**
   ```
   type(scope): description
   
   feat(auth): add JWT token refresh
   fix(booking): resolve double booking issue
   docs(readme): update installation instructions
   ```

3. **Pull Request Process**
   - Create feature branch from main
   - Write descriptive PR title and description
   - Ensure all tests pass
   - Request code review
   - Squash and merge after approval

### Code Review Checklist

- [ ] Code follows established conventions
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No sensitive data in commits
- [ ] Performance impact considered
- [ ] Security implications reviewed

### Development Workflow

1. **Setup Development Environment**
2. **Create Feature Branch**
3. **Implement Changes**
4. **Write/Update Tests**
5. **Update Documentation**
6. **Submit Pull Request**
7. **Address Review Comments**
8. **Merge to Main**

## Maintenance and Operations

### Application Monitoring

#### Key Performance Indicators (KPIs)
- Response time: < 200ms for API calls
- Availability: 99.9% uptime
- Error rate: < 0.1% of requests
- Database connection pool utilization: < 80%

#### Monitoring Setup
```csharp
// Application Insights integration
services.AddApplicationInsightsTelemetry();

// Custom health checks
services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>("database")
    .AddCheck<EmailServiceHealthCheck>("email_service")
    .AddCheck<FileSystemHealthCheck>("file_system");
```

#### Alerting Rules
- **Critical**: Database connection failures, application crashes
- **Warning**: High response times (>500ms), elevated error rates (>1%)
- **Info**: Deployment notifications, scheduled maintenance

### Scheduled Maintenance

#### Database Maintenance
```sql
-- Weekly maintenance script
-- Update statistics
ANALYZE TABLE equipment, bookings, users;

-- Clean up old logs (older than 90 days)
DELETE FROM audit_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);

-- Rebuild indexes if needed
OPTIMIZE TABLE equipment, bookings;
```

#### Log Cleanup
```powershell
# PowerShell script for log cleanup
$logPath = "C:\Apps\LabEMS\Logs"
$retentionDays = 30
Get-ChildItem $logPath -Filter "*.txt" | 
    Where-Object {$_.LastWriteTime -lt (Get-Date).AddDays(-$retentionDays)} | 
    Remove-Item -Force
```

### Capacity Planning

#### Database Growth Estimates
- Users: ~100 new users/month
- Equipment: ~20 new items/month  
- Bookings: ~500 bookings/month
- Audit logs: ~10,000 entries/month

#### Infrastructure Scaling
```yaml
# Kubernetes horizontal pod autoscaler
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: labems-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: labems-api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Error Handling

### Global Exception Handling

#### API Error Response Format
```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T Data { get; set; }
    public string Message { get; set; }
    public List<string> Errors { get; set; } = new();
    public string TraceId { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
```

#### Global Exception Middleware
```csharp
public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var response = new ApiResponse<object>
        {
            Success = false,
            Message = GetErrorMessage(exception),
            TraceId = context.TraceIdentifier
        };

        context.Response.StatusCode = GetStatusCode(exception);
        context.Response.ContentType = "application/json";

        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}
```

### Client-Side Error Handling

#### API Error Interceptor
```javascript
class ApiClient {
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            switch (response.status) {
                case 401:
                    this.handleUnauthorized();
                    break;
                case 403:
                    this.showError('Access denied');
                    break;
                case 404:
                    this.showError('Resource not found');
                    break;
                case 500:
                    this.showError('Server error occurred');
                    this.logError(errorData);
                    break;
                default:
                    this.showError(errorData.message || 'An error occurred');
            }
            
            throw new ApiError(response.status, errorData.message, errorData.traceId);
        }
        
        return response.json();
    }
}
```

### Error Categories and Handling

| Error Type | HTTP Status | Handling Strategy |
|------------|-------------|-------------------|
| Validation | 400 | Show field-specific errors |
| Authentication | 401 | Redirect to login |
| Authorization | 403 | Show access denied message |
| Not Found | 404 | Show friendly "not found" page |
| Conflict | 409 | Show conflict resolution options |
| Server Error | 500 | Show generic error, log details |

## Data Migration

### Database Migration Strategy

#### Version-Based Migrations
```sql
-- V003__add_equipment_categories.sql
CREATE TABLE equipment_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE equipment 
ADD COLUMN category_id INT,
ADD FOREIGN KEY (category_id) REFERENCES equipment_categories(id);
```

#### Data Migration Scripts
```sql
-- V004__migrate_equipment_categories.sql
INSERT INTO equipment_categories (name, description) VALUES
('Laboratory', 'General laboratory equipment'),
('Microscopy', 'Microscopes and related equipment'),
('Analytical', 'Analytical instruments');

-- Update existing equipment
UPDATE equipment e
SET category_id = (
    SELECT id FROM equipment_categories 
    WHERE name = CASE 
        WHEN e.name LIKE '%microscope%' THEN 'Microscopy'
        WHEN e.name LIKE '%analyzer%' THEN 'Analytical'
        ELSE 'Laboratory'
    END
);
```

#### Migration Rollback Strategy
```sql
-- Rollback script for V004
UPDATE equipment SET category_id = NULL;
DELETE FROM equipment_categories;
ALTER TABLE equipment DROP FOREIGN KEY equipment_ibfk_category;
ALTER TABLE equipment DROP COLUMN category_id;
DROP TABLE equipment_categories;
```

### Data Import/Export

#### Bulk Equipment Import
```csharp
public async Task<ImportResult> ImportEquipmentAsync(IFormFile file)
{
    var equipment = new List<EquipmentModel>();
    
    using var reader = new StringReader(await file.ReadAsStringAsync());
    using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
    
    var records = csv.GetRecords<EquipmentImportDto>();
    
    foreach (var record in records)
    {
        var equipmentModel = _mapper.Map<EquipmentModel>(record);
        equipment.Add(equipmentModel);
    }
    
    await _context.Equipment.AddRangeAsync(equipment);
    await _context.SaveChangesAsync();
    
    return new ImportResult { ImportedCount = equipment.Count };
}
```

#### Export Utilities
```csharp
public async Task<byte[]> ExportBookingsAsync(DateTime startDate, DateTime endDate)
{
    var bookings = await _context.Bookings
        .Include(b => b.User)
        .Include(b => b.Equipment)
        .Where(b => b.StartDate >= startDate && b.EndDate <= endDate)
        .ToListAsync();
    
    using var workbook = new XLWorkbook();
    var worksheet = workbook.Worksheets.Add("Bookings");
    
    worksheet.Cell(1, 1).InsertTable(bookings.Select(b => new
    {
        BookingId = b.Id,
        UserEmail = b.User.Email,
        EquipmentName = b.Equipment.Name,
        StartDate = b.StartDate,
        EndDate = b.EndDate,
        Purpose = b.Purpose
    }));
    
    using var stream = new MemoryStream();
    workbook.SaveAs(stream);
    return stream.ToArray();
}
```

## Backup and Recovery

### Database Backup Strategy

#### Automated Backup Script
```bash
#!/bin/bash
# daily_backup.sh

DB_NAME="labems"
DB_USER="backup_user"
DB_PASS="backup_password"
BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Perform backup
mysqldump -u$DB_USER -p$DB_PASS \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    $DB_NAME > $BACKUP_DIR/labems_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/labems_backup_$DATE.sql

# Remove backups older than 30 days
find $BACKUP_DIR -name "labems_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: labems_backup_$DATE.sql.gz"
```

#### Point-in-Time Recovery
```bash
# Enable binary logging in MySQL
[mysqld]
log-bin=mysql-bin
binlog-format=ROW
sync-binlog=1

# Recovery process
# 1. Restore from latest backup
mysql -u root -p labems < /backups/mysql/labems_backup_20251022_020000.sql

# 2. Apply binary logs from backup time to recovery point
mysqlbinlog --start-datetime="2025-10-22 02:00:00" \
           --stop-datetime="2025-10-22 14:30:00" \
           mysql-bin.000001 mysql-bin.000002 | mysql -u root -p labems
```

### Application Data Backup

#### File System Backup
```powershell
# PowerShell backup script
$sourceDir = "C:\Apps\LabEMS"
$backupDir = "\\backup-server\LabEMS\$(Get-Date -Format 'yyyyMMdd')"
$logFile = "C:\Logs\backup_$(Get-Date -Format 'yyyyMMdd').log"

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force

# Backup application files (excluding logs and temp files)
robocopy $sourceDir $backupDir /MIR /XD Logs Temp /XF *.tmp *.log /LOG:$logFile /TEE

# Backup configuration files separately
Copy-Item "$sourceDir\Configurations\*.json" "$backupDir\Configurations\" -Force
```

### Disaster Recovery Plan

#### Recovery Time Objectives (RTO)
- **Critical**: 1 hour (database, authentication)
- **Important**: 4 hours (full application functionality)
- **Normal**: 24 hours (reports, analytics)

#### Recovery Point Objectives (RPO)
- **Database**: 15 minutes (binary log backup frequency)
- **Application files**: 24 hours (daily backup)
- **Configuration**: Real-time (version controlled)

#### Emergency Procedures
1. **Database Failure**
   - Switch to backup database server
   - Restore from latest backup
   - Apply transaction logs
   - Update connection strings
   - Verify data integrity

2. **Application Server Failure**
   - Deploy to standby server
   - Restore application files
   - Update load balancer configuration
   - Verify functionality

3. **Complete Site Failure**
   - Activate disaster recovery site
   - Restore database from offsite backups
   - Deploy application to DR environment
   - Update DNS records
   - Notify stakeholders

---

## Appendices

### Appendix A: Environment Setup Checklist

#### Development Environment
- [ ] .NET 8.0 SDK installed
- [ ] Node.js 18+ installed
- [ ] MySQL 8.0+ installed and configured
- [ ] Visual Studio Code with recommended extensions
- [ ] Git configured with SSH keys
- [ ] Repository cloned and dependencies installed
- [ ] Database migrations applied
- [ ] Application starts successfully

#### Production Environment
- [ ] Web server configured (IIS/Nginx)
- [ ] SSL certificate installed
- [ ] Database server optimized
- [ ] Monitoring tools configured
- [ ] Backup procedures tested
- [ ] Security hardening applied
- [ ] Load balancer configured (if applicable)
- [ ] CDN configured for static assets

### Appendix B: Configuration Templates

#### Production appsettings.json Template
```json
{
  "Database": {
    "ConnectionString": "${DATABASE_CONNECTION_STRING}",
    "CommandTimeout": 30,
    "EnableRetryOnFailure": true,
    "MaxRetryCount": 3
  },
  "Jwt": {
    "SecretKey": "${JWT_SECRET_KEY}",
    "Issuer": "LabEMS-Production",
    "Audience": "LabEMS-Users",
    "ExpiryMinutes": 30,
    "RefreshTokenExpiryDays": 7
  },
  "Email": {
    "SmtpServer": "${SMTP_SERVER}",
    "Port": 587,
    "UseSsl": true,
    "Username": "${SMTP_USERNAME}",
    "Password": "${SMTP_PASSWORD}",
    "FromAddress": "noreply@yourdomain.com",
    "FromName": "LabEMS System"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "System": "Warning"
    }
  },
  "AllowedHosts": "yourdomain.com",
  "Cors": {
    "AllowedOrigins": ["https://yourdomain.com"]
  }
}
```

### Appendix C: Database Schema Reference

#### Complete Entity Relationship Diagram
```
Users                Equipment               Bookings
├── Id (PK)         ├── Id (PK)            ├── Id (PK)
├── Email           ├── Name               ├── UserId (FK)
├── DisplayName     ├── Description        ├── EquipmentId (FK)
├── PasswordHash    ├── SerialNumber       ├── StartDate
├── Role            ├── TypeId (FK)        ├── EndDate
├── CreatedAt       ├── StatusId (FK)      ├── Purpose
└── UpdatedAt       ├── CreatedAt          ├── StatusId (FK)
                    └── UpdatedAt          ├── CreatedAt
                                          └── UpdatedAt

Equipment_Types     Equipment_Status       Booking_Status
├── Id (PK)         ├── Id (PK)           ├── Id (PK)
├── Name            ├── Name              ├── Name
└── Description     └── Description       └── Description

Maintenance         Maintenance_Types     Maintenance_Status
├── Id (PK)         ├── Id (PK)          ├── Id (PK)
├── EquipmentId(FK) ├── Name             ├── Name
├── TypeId (FK)     └── Description      └── Description
├── StatusId (FK)
├── ScheduledDate
├── CompletedDate
├── Notes
├── CreatedAt
└── UpdatedAt

Audit_Logs
├── Id (PK)
├── UserId (FK)
├── Action
├── EntityType
├── EntityId
├── OldValues
├── NewValues
├── Timestamp
└── IpAddress
```

### Appendix D: Troubleshooting Guide

#### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Connection timeout" | Database server unreachable | Check network, verify connection string |
| "Invalid JWT token" | Token expired or malformed | Refresh token or re-authenticate |
| "CORS policy violation" | Frontend domain not whitelisted | Add domain to CORS policy |
| "Entity validation failed" | Invalid model data | Check required fields and data types |
| "Duplicate key constraint" | Attempting to create duplicate record | Check uniqueness constraints |

#### Performance Issues

| Symptom | Probable Cause | Investigation Steps |
|---------|----------------|-------------------|
| Slow API responses | Database query performance | Check query execution plans |
| High memory usage | Memory leaks in application | Profile memory usage patterns |
| High CPU usage | Inefficient algorithms | Profile CPU usage and optimize |
| Database timeouts | Long-running queries | Identify and optimize slow queries |

---

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