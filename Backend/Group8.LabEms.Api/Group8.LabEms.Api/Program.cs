using System;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Microsoft.Extensions.FileProviders;
using System.Text;
using System.Text.RegularExpressions;
using Group8.LabEms.Api.Middleware;

var builder = WebApplication.CreateBuilder(args);

string? _connectionString = string.Empty;


IConfiguration configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory() + "/Configurations")
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();

// Replace the default configuration with your custom one
builder.Configuration.AddConfiguration(configuration);

// Or register your configuration as a singleton
builder.Services.AddSingleton<IConfiguration>(configuration);


// CONFIG SERILOG
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug() // set default log level
    .WriteTo.Console()
    .WriteTo.File("Logs/labems_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog(); 

//CONFIGURE THE CORS 
//CORS HELP WITH WHITELISTING THE ORIGINS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173") // frontend URL
                .AllowAnyHeader()
                .AllowAnyMethod()
                .SetIsOriginAllowed(origin => true) // Allow same-origin requests
                .AllowCredentials();
        });
});


if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") == "Development")
{
    _connectionString = configuration.GetConnectionString("DefaultConnection");
    Console.WriteLine("connection string = " + _connectionString);
    Console.WriteLine("In Development environment");
}
else
{
    _connectionString = configuration.GetConnectionString("ProductionConnection");
    Console.WriteLine("In Production environment");
}


// Fix JSON serialization cycles for navigation properties
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        _connectionString,
        new MySqlServerVersion(new Version(8, 0, 36)) // use your MySQL version
    ));



// JWT Configuration
var jwtKey = configuration["Jwt:SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
        
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                context.Token = context.Request.Cookies["jwt"];
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddBusinessServices();

var app = builder.Build();

// Configure static file serving for frontend
// var frontendDistPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "..", "..", "frontend", "dist");
// app.UseStaticFiles(new StaticFileOptions
// {
//     FileProvider = new PhysicalFileProvider(frontendDistPath),
//     RequestPath = ""
// });

app.UseDefaultFiles();
app.UseStaticFiles();

// Middleware


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.UseAuditLogging();

// SPA fallback routing - serve index.html for non-API routes
app.MapFallbackToFile("index.html");

app.Run();

