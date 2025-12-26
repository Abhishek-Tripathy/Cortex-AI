import { NextRequest, NextResponse } from 'next/server';
import { validateQuery } from '@/lib/sql-guardrails';
import { db } from '@/db';
import { sql } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    const { sqlQueries } = await req.json();

    if (!sqlQueries || !Array.isArray(sqlQueries) || sqlQueries.length === 0) {
      return NextResponse.json({ error: 'SQL queries array is required' }, { status: 400 });
    }

    console.log(`Stage 2: Executing ${sqlQueries.length} queries...`);
    
    const results = [];

    for (const q of sqlQueries) {
        // Safety check
        if (!validateQuery(q)) {
            return NextResponse.json({ error: `SQL failed validation: ${q}` }, { status: 400 });
        }
        
        // Execute
        const res = await db.execute(sql.raw(q));
        results.push({
            query: q,
            data: res.rows,
            rowCount: res.rowCount
        });
    }
    
    return NextResponse.json({ results });

  } catch (error: any) {
    console.error('Stage 2 Error:', error);
    return NextResponse.json({ error: error.message || 'Database execution failed' }, { status: 500 });
  }
}
