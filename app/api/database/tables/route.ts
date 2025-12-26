import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Query information_schema to get all public tables
    const result = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    const tables = result.rows.map((row: any) => row.table_name);

    return NextResponse.json({ tables });
  } catch (error: any) {
    console.error('Error fetching tables:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
