import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Parse the DATABASE_URL to extract connection parameters
const dbUrl = new URL(process.env.DATABASE_URL);
const connectionConfig = {
  host: dbUrl.hostname,
  port: parseInt(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.slice(1), // Remove the leading slash
  connectTimeout: 10000,
};

let connection: mysql.Connection;
let db: ReturnType<typeof drizzle>;

async function initializeDatabase() {
  try {
    connection = await mysql.createConnection(connectionConfig);
    db = drizzle(connection, { schema, mode: 'default' });
    console.log('Database connected successfully');
    return { connection, db };
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

export { initializeDatabase };
export { connection, db };
