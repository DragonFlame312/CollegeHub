# CollegeHub - Student Resource Platform

CollegeHub is a comprehensive platform designed for college students, offering features like schedule management, study resources, discussion forums, and entertainment.

## Features

- **Authentication**: Email/password and College ID login methods
- **User Profiles**: Customizable user profiles with avatars
- **Admin Dashboard**: User management for administrators
- **Schedule**: Class and exam timetables
- **Resources**: Study materials and resources
- **Forum**: Discussion boards for students
- **Memes**: Entertainment section with memes

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: PostgreSQL
- **Authentication**: Custom auth implementation with sessions
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js (v16+)
- PostgreSQL database
- Bun package manager

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd college-hub
```

### 2. Install dependencies

```bash
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following content:

```
# Database configuration
USE_POSTGRES=true
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=collegehub
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Adjust the values to match your PostgreSQL installation.

### 4. Set up the database

Make sure PostgreSQL is running, then run:

```bash
bun run setup-db
```

This script will:
- Create the database if it doesn't exist
- Apply the schema
- Run migrations
- Add test users

### 5. Start the development server

```bash
bun run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Test Users

After running the setup script, the following users are available:

- **Admin**:
  - Email: admin@collegehub.com
  - Password: admin123

- **Student**:
  - Email: student@example.com
  - Password: password123
  - College ID: STU123
  - PIN: 1234

## Database Migrations

To create a new migration:

```bash
node scripts/create-migration.js "migration name"
```

This will create a timestamped SQL file in the `migrations` directory.

## Project Structure

```
college-hub/
├── src/                    # Source code
│   ├── app/                # Next.js app router
│   │   ├── admin/          # Admin dashboard
│   │   ├── forum/          # Forum pages
│   │   ├── login/          # Authentication pages
│   │   ├── memes/          # Entertainment section
│   │   ├── profile/        # User profile pages
│   │   ├── resources/      # Study resources
│   │   └── schedule/       # Schedule management
│   ├── components/         # Reusable components
│   └── lib/                # Utilities and shared code
│       ├── auth-context.tsx  # Authentication context
│       ├── database-interface.ts # Database interface
│       └── postgres-adapter.ts # PostgreSQL implementation
├── migrations/             # Database migrations
├── scripts/                # Utility scripts
│   ├── create-migration.js # Create new migration files
│   └── setup-database.js   # Database setup script
├── schema.sql              # Database schema
└── .env                    # Environment variables
```

## Authentication

The application uses a custom authentication system with two login methods:

1. **Email/Password**: Standard email and password authentication
2. **College ID**: Login using college ID and PIN

User sessions are stored in the database and managed via cookies.

## User Roles

- **User**: Regular student account
- **Moderator**: Can moderate forums and content
- **Admin**: Full access to admin features
- **Owner**: System administrator with all privileges

## License

This project is licensed under the MIT License.
