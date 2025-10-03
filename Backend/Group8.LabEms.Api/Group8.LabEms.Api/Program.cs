using System;
using Group8.LabEms.Api.Data;
//using Group8.LabEms.Api.Services;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

string? _connectionString = string.Empty;


IConfiguration configuration = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory() + "/Configurations")
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .Build();




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
                .AllowAnyMethod();
                
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
app.UseAuthorization();
app.MapControllers();

app.Run();

