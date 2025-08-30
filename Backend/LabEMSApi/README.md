# Lab Equipment Management and Scheduling System

## 📌 Overview
Follow this guide to bootup the boilerplate

## 🏗 Project Structure

- **Controllers/** → Handles API endpoints (e.g., EquipmentController, BookingController)
- **Data/** → Database context and migrations
- **DTOs/** → Data Transfer Objects (request/response models)
- **Middlewares/** → Custom middleware (e.g., role-based authorization)
- **Services/** → Business logic (equipment booking, availability checks)
- **Repository/** → Data access layer (CRUD operations, queries)
- **Models/** → Entity classes (Equipment, User, Booking, etc.)
- **Exceptions/** -> contains global exception handlers.


## ⚙️ Requirements
- .NET 8.0 SDK (8.0.100 or higher)
-  MySQL will be configure in `appsettings.json`

## 🚀 Running the Backend

```bash
docker build -t lab-ems-api .

docker run -d -p 5000:5000 -p 7000:7000 --name labemsapi labemsapi

cd backend/LabEMSAPI
dotnet restore    # install dependencies
dotnet build      # build the project
dotnet run        # run the API
