# PostgreSQL Setup and Authentication Guide for CollegeHub

This guide provides detailed instructions on setting up PostgreSQL for CollegeHub and understanding the authentication system.

## Table of Contents

1. [PostgreSQL Installation](#postgresql-installation)
2. [Database Setup](#database-setup)
3. [Schema Understanding](#schema-understanding)
4. [Authentication System](#authentication-system)
5. [User Profile Management](#user-profile-management)
6. [Admin Dashboard](#admin-dashboard)
7. [Troubleshooting](#troubleshooting)

## PostgreSQL Installation

### Ubuntu/Debian

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### macOS (using Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

### Windows

Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/).

### Verify Installation

```bash
psql --version
```

## Database Setup

### Manual Setup

If you prefer to set up the database manually instead of using our script:

1. Create a database and user:

```bash
sudo -u postgres psql

postgres=# CREATE DATABASE collegehub;
postgres=# CREATE USER collegehub_user WITH ENCRYPTED PASSWORD 'your_password';
postgres=# GRANT ALL PRIVILEGES ON DATABASE collegehub TO collegehub_user;
postgres=# \q
```

2. Apply the schema:

```bash
psql -U collegehub_user -d collegehub -a -f schema.sql
```

3. Apply migrations:

```bash
psql -U collegehub_user -d collegehub -a -f migrations/01_setup_schema.sql
```

### Automated Setup

We provide a script that automates the setup process:

```bash
bun run setup-db
```

This script will:
1. Create the database if it doesn't exist
2. Apply the schema
3. Run all migrations in order
4. Add test users for immediate testing

### Environment Configuration

Ensure your `.env` file has the correct PostgreSQL connection details:

```
USE_POSTGRES=true
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=collegehub
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

## Schema Understanding

The CollegeHub database consists of several key tables:

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college_id VARCHAR(50) UNIQUE,
    pin_hash VARCHAR(255),
    avatar_url VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

This table stores user accounts with:
- Regular email/password authentication
- College ID authentication
- Role-based permissions

### Sessions Table

```sql
CREATE TABLE sessions (
    token VARCHAR(255) PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

This table stores authentication sessions, allowing:
- Persistent logins across page refreshes
- Session timeout handling
- Multiple device sessions

## Authentication System

CollegeHub implements a custom authentication system with two login methods:

### Email/Password Authentication

1. User enters email and password
2. Password is verified against hashed value in database
3. New session token is generated and stored
4. Session token is set as a cookie
5. User is redirected to home page

Implementation: `login()` method in `auth-context.tsx`

### College ID Authentication

1. User enters college ID and PIN
2. PIN is verified against hashed value in database
3. New session token is generated and stored
4. Session token is set as a cookie
5. User is redirected to home page

Implementation: `loginWithCollegeId()` method in `auth-context.tsx`

### Session Management

Sessions are:
- Stored in the database with an expiration time
- Tied to the user account
- Delivered to the client via cookies
- Checked on each request requiring authentication

### Password Storage

Passwords are:
- Never stored in plain text
- Hashed using bcrypt with a cost factor of 10
- Validated via comparison with the stored hash

## User Profile Management

Users can edit their profile information:

1. Navigate to `/profile`
2. Update name, email, and avatar URL
3. Changes are persisted to the database

Profile data is loaded from the database on component mount and updated in real-time.

## Admin Dashboard

The admin dashboard at `/admin` provides:

1. Overview of user statistics
2. User management interface
3. Role assignment capabilities

Access is restricted to users with 'admin' or 'owner' roles.

## Troubleshooting

### Connection Issues

If you encounter database connection issues:

1. Verify PostgreSQL is running:
   ```bash
   sudo service postgresql status  # Ubuntu/Debian
   brew services list              # macOS
   ```

2. Check your connection details in `.env`

3. Ensure the database exists:
   ```bash
   psql -U postgres -c "\l"  # List all databases
   ```

4. Test connection:
   ```bash
   psql -U postgres -d collegehub -c "SELECT 1"
   ```

### Authentication Problems

If users can't log in:

1. Reset the admin password:
   ```sql
   UPDATE users
   SET password_hash = '$2a$10$dSCFRyhCzn52jMlXoOrC1eGVekimcxU8nhyYiQHJf9O9cQgwV8Vtu'
   WHERE email = 'admin@collegehub.com';
   ```
   This resets the password to 'admin123'

2. Check for expired sessions:
   ```sql
   DELETE FROM sessions WHERE expires_at < NOW();
   ```

3. Verify the cookies are being set correctly:
   - Check browser developer tools > Application > Cookies

### Schema Issues

If you need to reset the database:

```bash
psql -U postgres -c "DROP DATABASE IF EXISTS collegehub;"
```

Then run the setup script again:

```bash
bun run setup-db
```

## Custom Migrations

To create a custom migration:

```bash
node scripts/create-migration.js "add user preferences"
```

This creates a timestamped migration file in the `migrations` directory. Edit this file to add your SQL statements.
