import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import * as relations from './relations';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

// Force search_path to public
pool.on('connect', (client) => {
  client.query("SET search_path TO public");
});

export const db = drizzle(pool, { schema: { ...schema, ...relations } });
