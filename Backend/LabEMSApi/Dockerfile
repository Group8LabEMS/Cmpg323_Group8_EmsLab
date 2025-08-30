# ============================
# Stage 1: Build
# ============================
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution file and restore dependencies
COPY Cmpg323_Group8_EmsLab/Backend/LabEMSApi/*.csproj ./LabEMSApi/
RUN dotnet restore ./LabEMSApi/LabEMSApi.csproj

# Copy all source files
COPY Cmpg323_Group8_EmsLab/Backend/LabEMSApi/. ./LabEMSApi/
WORKDIR /src/LabEMSApi

# Publish the project
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# ============================
# Stage 2: Runtime
# ============================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Copy published output
COPY --from=build /app/publish .

# Expose API ports
EXPOSE 5000
EXPOSE 7000

# Start the API
ENTRYPOINT ["dotnet", "LabEMSApi.dll"]