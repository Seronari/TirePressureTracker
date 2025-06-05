import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema";

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '3306'),
  user: process.env.PGUSER || 'root',
  password: process.env.PGPASSWORD || '',
  database: process.env.PGDATABASE || 'farsensor',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: 'default' });

export async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}
