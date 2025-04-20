#!/usr/bin/env node

/**
 * This script creates a new migration file with a timestamp prefix.
 * Usage: node scripts/create-migration.js "migration name"
 */

const fs = require('fs');
const path = require('path');

// Get migration name from command line arguments
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Please provide a migration name');
  console.error('Usage: node scripts/create-migration.js "migration name"');
  process.exit(1);
}

// Convert migration name to snake case
const snakeCaseName = migrationName
  .toLowerCase()
  .replace(/\s+/g, '_')
  .replace(/[^a-z0-9_]/g, '');

// Create timestamp
const now = new Date();
const timestamp = now.toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);

// Create migration file name
const fileName = `${timestamp}_${snakeCaseName}.sql`;

// Create migrations directory if it doesn't exist
const migrationsDir = path.join(__dirname, '..', 'migrations');
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Create migration file content
const content = `-- Migration: ${migrationName}
-- Created at: ${now.toISOString()}

-- Write your SQL statements here

-- UP Migration (changes to apply)


-- DOWN Migration (how to revert)
-- Keep this commented out, but write revert steps for reference
/*

*/
`;

// Write migration file
const filePath = path.join(migrationsDir, fileName);
fs.writeFileSync(filePath, content, 'utf8');

console.log(`Created migration file: ${filePath}`);
console.log('Remember to add your SQL statements to this file.');
