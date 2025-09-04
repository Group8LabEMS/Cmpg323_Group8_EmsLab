using Group8.LabEms.Api.Data;
using Group8.LabEms.Api.Services;
using Microsoft.EntityFrameworkCore;

using MySqlConnector;



var builder = WebApplication.CreateBuilder(args);

//ALL SERVICES HERE
builder.Services.AddScoped<IEquipmentService, EquipmentService>();


// Add services to the container
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

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

