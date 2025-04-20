# Database Setup Guide for CollegeHub

This document explains how to set up and configure the database for the CollegeHub application.

## Overview

CollegeHub is designed with a flexible database architecture that can work with various database backends:

1. **PostgreSQL/MySQL** - For traditional SQL database setups
2. **Google Cloud Storage/Firebase** - For cloud-hosted options
3. **MongoDB** - For document-based NoSQL setups

The application uses a database interface layer (`DatabaseInterface`) that abstracts away the specific database implementation, allowing you to choose the backend that best suits your needs.

## Database Schema

The database schema includes the following main entities:

- **Users**: Student accounts and administrators
- **Forums**: Discussion boards and sub-forums
- **Posts**: Individual posts within forums
- **Resources**: Study materials, notes, and links
- **Memes**: Meme images and content
- **Schedule**: Classes, exams, and events

## Setting Up With PostgreSQL

1. Install PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Create a database:
   ```bash
   sudo -u postgres createdb collegehub
   ```

3. Create a database user:
   ```bash
   sudo -u postgres createuser --interactive
   ```

4. Set up database schema:
   ```bash
   psql -U yourusername -d collegehub -a -f schema.sql
   ```

5. Configure environment variables:
   ```
   DATABASE_TYPE=postgres
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=collegehub
   POSTGRES_USER=yourusername
   POSTGRES_PASSWORD=yourpassword
   ```

## Setting Up With Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)

2. Install Firebase tools:
   ```bash
   npm install -g firebase-tools
   ```

3. Login to Firebase:
   ```bash
   firebase login
   ```

4. Initialize Firebase in your project:
   ```bash
   firebase init
   ```

   Select Firestore, Storage, and Authentication options

5. Configure environment variables:
   ```
   DATABASE_TYPE=firebase
   FIREBASE_API_KEY=your-api-key
   FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   FIREBASE_APP_ID=your-app-id
   ```

## Implementing Your Database Provider

To implement a specific database provider:

1. Create a new class that implements the `DatabaseInterface` (e.g., `PostgreSQLDatabase.ts` or `FirebaseDatabase.ts`)
2. Implement all the methods defined in the interface with your database-specific code
3. Update the `getDatabase()` function in `database-interface.ts` to return your implementation

Example for PostgreSQL implementation:

```typescript
import { Pool } from 'pg';
import { DatabaseInterface } from './database-interface';

export class PostgreSQLDatabase implements DatabaseInterface {
  private pool: Pool;
  private static instance: PostgreSQLDatabase;

  private constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });

    console.log('PostgreSQL database service initialized');
  }

  public static getInstance(): PostgreSQLDatabase {
    if (!PostgreSQLDatabase.instance) {
      PostgreSQLDatabase.instance = new PostgreSQLDatabase();
    }
    return PostgreSQLDatabase.instance;
  }

  // Implement all interface methods here...

  async getCurrentUser(): Promise<User | null> {
    // Example implementation
    try {
      const token = getAuthToken(); // Get from cookies/session
      if (!token) return null;

      const { rows } = await this.pool.query(
        'SELECT * FROM users WHERE token = $1',
        [token]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // ...implement other methods
}

// Update the getDatabase function to use your implementation
export const getDatabase = (): DatabaseInterface => {
  if (process.env.DATABASE_TYPE === 'postgres') {
    return PostgreSQLDatabase.getInstance();
  } else if (process.env.DATABASE_TYPE === 'firebase') {
    return FirebaseDatabase.getInstance();
  } else {
    // Default to mock service for development
    return DatabaseService.getInstance();
  }
};
```

## Database Backups

For production deployments, it's recommended to set up regular backups:

### PostgreSQL Backups
```bash
pg_dump -U yourusername collegehub > backup_$(date +%Y%m%d).sql
```

### Firebase Backups
Use Firebase Admin SDK to export your data periodically:
```javascript
const firebaseAdmin = require('firebase-admin');
const fs = require('fs');

firebaseAdmin.initializeApp();

async function backupFirestore() {
  const backup = await firebaseAdmin.firestore().collection('/').get();
  const data = backup.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  fs.writeFileSync(
    `backup_${new Date().toISOString().slice(0, 10)}.json`,
    JSON.stringify(data, null, 2)
  );
}

backupFirestore();
```

## Security Considerations

1. **Never expose database credentials** in client-side code
2. **Use environment variables** for sensitive configuration
3. **Implement proper authentication** before allowing database operations
4. **Add validation** on all user inputs before sending to the database
5. **Use prepared statements** to prevent SQL injection
6. **Set up proper database roles and permissions** to limit access

## Performance Optimization

1. **Add indexes** on frequently queried fields
2. **Consider caching** for frequently accessed data
3. **Implement pagination** for large data sets
4. **Monitor query performance** and optimize slow queries

## Next Steps

1. Choose your database provider based on your specific needs
2. Implement the corresponding database adapter class
3. Set up your database schema using the provided models
4. Configure the application to use your database implementation
5. Set up a backup strategy for production data
