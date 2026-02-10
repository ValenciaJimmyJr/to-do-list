// server/db.js
import pg from "pg";

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL, // Use Render's environment variable
  ssl: {
    rejectUnauthorized: false, // Required for Neon/PostgreSQL hosted databases
  },
});
