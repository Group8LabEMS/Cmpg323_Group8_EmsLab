using System;
using System.Text;
using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Models.Dto;

//using Group8.LabEms.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
    .SetBasePath(AppContext.BaseDirectory)
    .AddJsonFile("Configurations/appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile("Configurations/database.json", optional: false, reloadOnChange: true);

//JWT CONFIGURATION
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.Configure<JwtSettings>(jwtSettings);

Console.WriteLine($"JWT Secret: {jwtSettings["Secret"]}");
var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);


builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero

    };
});

//THESE ARE THE ROLES THAT CAN BE AUTHORIZED.
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
    options.AddPolicy("Student", policy => policy.RequireRole("Student"));
    options.AddPolicy("LabManager", policy => policy.RequireRole("LabManager"));
    options.AddPolicy("LabTechnician", policy => policy.RequireRole("LabTechnician"));
});



// CONFIG SERILOG
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
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
                .AllowAnyMethod();

        });
});

Console.WriteLine("Connection string = " + builder.Configuration.GetConnectionString("DefaultConnection"));

// Fix JSON serialization cycles for navigation properties
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        "server=localhost;port=3306;database=labems;user=root;password=root;",
        new MySqlServerVersion(new Version(8, 4, 6)) // use your MySQL version

        // "server=localhost;port=3306;database=labems;user=root;password=labems12345;",
        // new MySqlServerVersion(new Version(8, 0, 36)) // use your MySQL version
    ));


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

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

app.Run();

