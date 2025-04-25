import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  port: Number(process.env.PGPORT),
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

// client.connect()
//   .then(() => console.log('DB connected!'))
//   .catch(err => console.error('DB connection error',err));

export default pool;


