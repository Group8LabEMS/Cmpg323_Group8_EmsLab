using System;
using Group8.LabEms.Api.Data;
//using Group8.LabEms.Api.Services;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


Console.WriteLine("Connection string = " + builder.Configuration.GetConnectionString("DefaultConnection"));


builder.Services.AddControllers();


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        "server=localhost;port=3306;database=labems;user=root;password=labems12345;",
        new MySqlServerVersion(new Version(8, 0, 36)) // use your MySQL version
    ));

//builder.Services.AddDbContext<AppDbContext>(options =>
  //  options.UseMySql(
    //    builder.Configuration.GetConnectionString("DefaultConnection"),
      //  ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
   //));

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

