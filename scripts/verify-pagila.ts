import { config } from 'dotenv';
config({ path: '.env.local' });

import { count, eq } from 'drizzle-orm';

import { sql } from 'drizzle-orm';

async function main() {
  const { db } = await import('../db/index');
  const { actor, film } = await import('../db/schema');

  try {
    console.log('Verifying Pagila Database...');

    // Debug: Try raw SQL first
    console.log('Testing raw SQL...');
    const rawRes = await db.execute(sql`SELECT count(*) FROM actor`);
    console.log('Raw SQL count result:', rawRes.rows[0]);

    // Count actors
    const query = db.select({ count: count() }).from(actor);
    console.log('Generated SQL:', query.toSQL());
    const actorCount = await query;
    console.log(`\nActors count: ${actorCount[0].count}`);

    // Fetch first 5 films
    const films = await db.select().from(film).limit(5);
    console.log('\nSample Films:');
    films.forEach(f => console.log(`- ${f.title} (${f.releaseYear})`));

    console.log('\nVerification successful!');
  } catch (err) {
    console.error('Verification failed:', err);
    process.exit(1);
  } finally {
    // Need to close pool, but db object doesn't expose it directly easily in this setup 
    // unless we exported pool or use process.exit
    process.exit(0);
  }
}
main();
