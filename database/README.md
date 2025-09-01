# Database Setup

This folder contains SQL scripts for creating and managing the database for the Equipment Management System (EMS).

## Available Scripts

- **create_tables_mysql.sql**: MySQL-compatible version of the database schema

## MySQL Docker Setup Guide

### 1. Pull MySQL Docker Image

```bash
# Pull the latest MySQL image
docker pull mysql:8.0

# Or pull a specific version
docker pull mysql:5.7
```

### 2. Run MySQL Container

```bash
# Run MySQL container with environment variables
docker run --name ems-mysql -e MYSQL_ROOT_PASSWORD=your_root_password -e MYSQL_DATABASE=ems_lab -e MYSQL_USER=ems_user -e MYSQL_PASSWORD=ems_password -p 3306:3306 -d mysql:8.0

# Optional: Mount a volume for data persistence
docker run --name ems-mysql -e MYSQL_ROOT_PASSWORD=your_root_password -e MYSQL_DATABASE=ems_lab -e MYSQL_USER=ems_user -e MYSQL_PASSWORD=ems_password -p 3306:3306 -v /path/on/host/mysql-data:/var/lib/mysql -d mysql:8.0
```

### 3. Verify Container is Running

```bash
docker ps
```

### 4. Connect to MySQL Container from Terminal

```bash
# Connect as root
docker exec -it ems-mysql mysql -uroot -p

# Connect with created user
docker exec -it ems-mysql mysql -uems_user -p
```

### 5. Import Database Schema

```bash
# Copy SQL file to container
docker cp create_tables_mysql.sql ems-mysql:/tmp/

# Execute SQL file in MySQL
docker exec -it ems-mysql bash -c "mysql -uems_user -pems_password ems_lab < /tmp/create_tables_mysql.sql"
```

## Connecting to MySQL from VS Code

### 1. Install Database Extensions

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X or Cmd+Shift+X)
3. Search for and install:
   - "MySQL" by Jun Han
   - "SQLTools" by Matheus Teixeira
   - "SQLTools MySQL/MariaDB" by Matheus Teixeira

### 2. Connect to MySQL Database

#### Using SQLTools Extension:

1. Click on the SQLTools icon in the left sidebar
2. Click "Add New Connection"
3. Select "MySQL"
4. Enter the connection details:
   - Name: EMS Lab Database
   - Host: localhost
   - Port: 3306
   - Username: ems_user
   - Password: ems_password
   - Database: ems_lab
5. Click "Test Connection" to verify
6. Click "Save Connection"

#### Using MySQL Extension:

1. Click on the MySQL icon in the left sidebar
2. Click "+" to add a new connection
3. Enter the connection details:
   - Connection Name: EMS Lab
   - Host: localhost
   - Port: 3306
   - User: ems_user
   - Password: ems_password
   - Database: ems_lab
4. Click "OK" to connect

### 3. Execute SQL Queries in VS Code

1. Connect to your database using either extension
2. Create a new SQL file or open existing SQL file
3. Select the connection to use
4. Write your SQL query
5. Right-click and select "Run Query" or use the extension's run button
6. View the results in the output panel

### 4. Managing Database with VS Code

- Browse tables, views, and stored procedures in the explorer view
- Generate scripts by right-clicking on database objects
- Export query results to CSV, JSON, or Excel
- Create, edit, and delete database objects using the GUI or SQL queries

## Database Schema

The system uses a relational database with the following tables:

- **user**: Stores user information and authentication details
- **role**: Contains system roles (e.g., Admin, User, Manager)
- **user_role**: Many-to-many relationship between users and roles
- **equipment**: Contains equipment records and availability status
- **booking**: Tracks equipment bookings by users
- **maintenance**: Logs maintenance schedules and history
- **auditlog**: System audit trail for tracking changes and activities

## Entity Relationship Diagram (ERD)

The database structure is based on the ERD located at TBC!!!

## Additional Database Setup Instructions

### For Local MySQL Installation

1. Install MySQL Server if not already installed
2. Create a new database:
   ```sql
   CREATE DATABASE ems_lab;
   USE ems_lab;
   ```
3. Run the MySQL script:
   ```
   mysql -u username -p ems_lab < create_tables_mysql.sql
   ```

### For Docker Compose Setup

You can also use Docker Compose for a more declarative setup:

1. Create a `docker-compose.yml` file in the project root:

```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: ems-mysql
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: ems_lab
      MYSQL_USER: ems_user
      MYSQL_PASSWORD: ems_password
    volumes:
      - ./database:/docker-entrypoint-initdb.d
      - mysql-data:/var/lib/mysql
    networks:
      - ems-network

volumes:
  mysql-data:

networks:
  ems-network:
    driver: bridge
```

2. Start the database:

```bash
docker-compose up -d
```

3. The SQL scripts in the database folder will be automatically executed during container initialization.

### Common Docker MySQL Commands

```bash
# Start container
docker start ems-mysql

# Stop container
docker stop ems-mysql

# View logs
docker logs ems-mysql

# Remove container
docker rm ems-mysql
```

## Best Practices

- Always back up your database before making schema changes
- Use prepared statements in your application code to prevent SQL injection
- Consider adding indexes to frequently queried columns
- For production, ensure you have properly configured user permissions
- Don't store sensitive information like passwords in plain text

## Database Migrations

As the application evolves, you may need to update the database schema. Follow these steps:

1. Create a migration script in a new file (e.g., `migrations/001_add_column_x.sql`)
2. Document changes in this README
3. Test migrations in a development environment before applying to production

## Database Connection Parameters

Sample connection parameters (update these for your environment):

- **Host**: localhost
- **Port**: 3306 (MySQL) or file path for SQLite
- **Database**: ems_lab
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci

## Troubleshooting Docker MySQL Setup

### Cannot Connect to MySQL Container

1. Check if container is running:
   ```bash
   docker ps | grep ems-mysql
   ```

2. Verify port mapping:
   ```bash
   docker port ems-mysql
   ```

3. Check container logs:
   ```bash
   docker logs ems-mysql
   ```

4. Ensure no other service is using port 3306 on your host machine

### Data Not Persisting After Container Restart

1. Ensure you've set up volume mapping correctly
2. Use Docker volumes instead of bind mounts for better compatibility

### Permission Issues

1. Check user permissions in MySQL:
   ```bash
   docker exec -it ems-mysql mysql -uroot -p -e "SELECT User, Host FROM mysql.user;"
   ```

2. Grant necessary permissions:
   ```bash
   docker exec -it ems-mysql mysql -uroot -p -e "GRANT ALL PRIVILEGES ON ems_lab.* TO 'ems_user'@'%';"
   docker exec -it ems-mysql mysql -uroot -p -e "FLUSH PRIVILEGES;"
   ```

### VS Code Connection Issues

1. Check if you can connect using MySQL command line client first
2. Verify connection parameters, especially host and port
3. Ensure the MySQL extensions in VS Code are up to date
4. Try using the connection string format instead of individual parameters
