using System;
using Group8.LabEms.Api.Data;
//using Group8.LabEms.Api.Services;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

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



Console.WriteLine("Connection string = " + builder.Configuration.GetConnectionString("DefaultConnection"));




builder.Services.AddControllers();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        "server=localhost;port=3306;database=labems;user=root;password=root;",
        new MySqlServerVersion(new Version(8, 4, 6)) // use your MySQL version

        // "server=localhost;port=3306;database=labems;user=root;password=labems12345;",
        // new MySqlServerVersion(new Version(8, 0, 36)) // use your MySQL version
    ));

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseMySql(
//        builder.Configuration.GetConnectionString("DefaultConnection"),
//        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
//    ));

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

