# Use the official .NET SDK image for build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Copy everything else and build
COPY . ./
RUN dotnet publish -c Release -o out

# Use the official ASP.NET Core runtime image for run
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Expose port 80 and 443
EXPOSE 8080
EXPOSE 443

# Set environment variables if needed
ENV ASPNETCORE_ENVIRONMENT=Development

ENTRYPOINT ["dotnet", "Group8.LabEms.Api.dll"]
