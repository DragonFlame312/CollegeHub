#!/usr/bin/env node

/**
 * This script sets up the PostgreSQL database for CollegeHub.
 * It creates the database, applies the schema, and adds test data.
 */

const { execSync } = require('child_process');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Configuration (can be moved to environment variables)
const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'collegehub',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
};

// Create database if it doesn't exist
async function createDatabase() {
  try {
    // Connect to PostgreSQL without specifying a database
    const pgPool = new Pool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: 'postgres', // Connect to default database
    });

    // Check if our database exists
    const res = await pgPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [config.database]
    );

    // If database doesn't exist, create it
    if (res.rows.length === 0) {
      console.log(`Creating database: ${config.database}`);
      await pgPool.query(`CREATE DATABASE ${config.database}`);
    } else {
      console.log(`Database ${config.database} already exists`);
    }

    await pgPool.end();
    return true;
  } catch (error) {
    console.error('Error creating database:', error);
    return false;
  }
}

// Apply schema to database
async function applySchema() {
  try {
    console.log('Applying schema to database...');

    // Read schema file
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Connect to the database
    const pool = new Pool(config);

    // Execute schema
    await pool.query(schema);

    // Apply migration scripts
    const migrationsDir = path.join(__dirname, '..', 'migrations');
    const migrations = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sort to ensure they're applied in order

    for (const migration of migrations) {
      console.log(`Applying migration: ${migration}`);
      const migrationPath = path.join(migrationsDir, migration);
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      await pool.query(migrationSql);
    }

    await pool.end();
    return true;
  } catch (error) {
    console.error('Error applying schema:', error);
    return false;
  }
}

// Add test data to database
async function addTestData() {
  try {
    console.log('Adding test data to database...');

    // Connect to the database
    const pool = new Pool(config);

    // Check if admin user exists
    const adminCheck = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      ['admin@collegehub.com']
    );

    // Add admin user if it doesn't exist
    if (adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await pool.query(
        `INSERT INTO users (name, email, password_hash, role)
         VALUES ($1, $2, $3, $4)`,
        ['Admin', 'admin@collegehub.com', hashedPassword, 'owner']
      );

      console.log('Added admin user (admin@collegehub.com / admin123)');
    } else {
      console.log('Admin user already exists');
    }

    // Add a test user with college ID
    const testUserCheck = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      ['student@example.com']
    );

    if (testUserCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const hashedPin = await bcrypt.hash('1234', 10);

      await pool.query(
        `INSERT INTO users (name, email, password_hash, college_id, pin_hash, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['Test Student', 'student@example.com', hashedPassword, 'STU123', hashedPin, 'user']
      );

      console.log('Added test user (student@example.com / password123, College ID: STU123 / PIN: 1234)');
    } else {
      console.log('Test user already exists');
    }

    await pool.end();
    return true;
  } catch (error) {
    console.error('Error adding test data:', error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Setting up CollegeHub database...');

  // Create database
  const dbCreated = await createDatabase();
  if (!dbCreated) {
    console.error('Failed to create database. Exiting...');
    process.exit(1);
  }

  // Apply schema
  const schemaApplied = await applySchema();
  if (!schemaApplied) {
    console.error('Failed to apply schema. Exiting...');
    process.exit(1);
  }

  // Add test data
  const dataAdded = await addTestData();
  if (!dataAdded) {
    console.error('Failed to add test data. Exiting...');
    process.exit(1);
  }

  console.log('Database setup completed successfully!');
  console.log('You can now start the application with:');
  console.log('  bun run dev');
  console.log('\nLogin credentials:');
  console.log('  Admin: admin@collegehub.com / admin123');
  console.log('  Test user: student@example.com / password123');
  console.log('  College ID: STU123 / PIN: 1234');
}

// Run the script
main().catch(console.error);
