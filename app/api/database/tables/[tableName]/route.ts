import { NextResponse, NextRequest } from 'next/server';
import { db } from '../../../../../db';
import { sql } from 'drizzle-orm';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ tableName: string }> }
) {
  try {
    const { tableName } = await params;

    // 1. Security Check: Verify table exists in schema to prevent SQL Injection
    const validationResult = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = ${tableName};
    `);

    if (validationResult.rows.length === 0) {
      return NextResponse.json({ error: 'Table not found' }, { status: 404 });
    }

    // 2. Fetch Data (Limit 30 as requested)
    // specific SQL construction since table names can't be parameterized directly in SELECT FROM
    const dataResult = await db.execute(sql.raw(`SELECT * FROM "${tableName}" LIMIT 30`));

    return NextResponse.json({ 
      tableName,
      rowCount: dataResult.rowCount,
      rows: dataResult.rows 
    });
  } catch (error: any) {
    console.error(`Error fetching data for table ${params}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
