import { config } from 'dotenv';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected to database.');

    // 1. Import Schema
    const schemaPath = path.join(process.cwd(), 'scripts', 'pagila-schema.sql');
    console.log(`Reading schema from ${schemaPath}...`);
    let schemaSql = fs.readFileSync(schemaPath, 'utf8');

    // Sanitize schema: remove owner assignments and role grants
    schemaSql = schemaSql
      .replace(/ALTER TABLE .* OWNER TO postgres;/g, '')
      .replace(/ALTER .* OWNER TO postgres;/g, '') // Catch functions, types, etc.
      .replace(/GRANT .* TO postgres;/g, '');

    console.log('Executing schema import...');
    await client.query(schemaSql);
    console.log('Schema import completed.');

    // 2. Import Data
    const dataPath = path.join(process.cwd(), 'scripts', 'pagila-insert-data.sql');
    console.log(`Reading data from ${dataPath}...`);
    let dataSql = fs.readFileSync(dataPath, 'utf8');

    // Sanitize data if necessary (usually data dumps don't have ownership, but good to be safe)
    dataSql = dataSql
        .replace(/ALTER TABLE .* OWNER TO postgres;/g, '')
        .replace(/ALTER .* OWNER TO postgres;/g, '');

    console.log('Executing data import (this might take a moment)...');
    await client.query(dataSql);
    console.log('Data import completed.');

  } catch (err) {
    console.error('Error importing database:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

main();
