import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',          // your DB username
  host: 'localhost',         // usually localhost
  database: 'to_do_list',       // your DB name
  password: 'jimmy123', // DB password
  port: 5432                 // default PostgreSQL port
});
