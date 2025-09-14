using System;
using Group8.LabEms.Api.Data;
using Microsoft.EntityFrameworkCore;
using Group8.LabEms.Api.Services;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("Connection string = " + builder.Configuration.GetConnectionString("DefaultConnection"));

// Add services to the container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        "server=localhost;port=3306;database=ems_lab;user=ems_user;password=ems_password;",
        new MySqlServerVersion(new Version(8, 0, 36)) // use your MySQL version
    ));

//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseMySql(
//        builder.Configuration.GetConnectionString("DefaultConnection"),
//        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
//    ));

Console.WriteLine("Added Project Services");
builder.Services.AddProjectServices();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

