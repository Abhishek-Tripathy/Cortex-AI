import { NextRequest, NextResponse } from 'next/server';
import { generateText, MODEL_NAME } from '@/lib/llm-client';
import { getSchemaContext } from '@/lib/schema-context';
import { validateQuery } from '@/lib/sql-guardrails';
import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { z } from 'zod';

// Define the response structure we want from the LLM
const ReportSchema = z.object({
  sqlQuery: z.string(),
  explanation: z.string(),
  visualization: z.object({
    type: z.enum(['table', 'bar', 'line', 'pie', 'singleValue']),
    title: z.string(),
    xKey: z.string().optional().describe('Key for x-axis or category'),
    yKey: z.string().optional().describe('Key for y-axis or value'),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const schemaContext = getSchemaContext();
    
    // Step 1: Generate SQL
    // We ask the LLM to provide the SQL AND the visualization metadata in one go to be efficient.
    const systemPrompt = `
    You are an expert Data Analyst using PostgreSQL.
    
    Context:
    ${schemaContext}
    
    Instructions:
    1. Generate a read-only PostgreSQL query to answer the question.
    2. The query must be standard PostgreSQL.
    3. Determine the best way to visualize the result (Table, Bar Chart, Line Chart, Pie Chart, or Single Value).
    4. Provide a brief explanation of what the data represents.
    5. Return ONLY a JSON object matching this structure:
    {
      "sqlQuery": "SELECT ...",
      "explanation": "Brief description",
      "visualization": {
        "type": "table" | "bar" | "line" | "pie" | "singleValue",
        "title": "Chart Title",
        "xKey": "column_name_for_x_axis",
        "yKey": "column_name_for_y_axis"
      }
    }
    `;

    console.log(`Generating report with model: ${MODEL_NAME}`);
    
    // Construct the full prompt for the chat model
    const fullPrompt = systemPrompt + '\n\nUser Question: "' + question + '"';
    
    const responseText = await generateText(fullPrompt);
    
    // Clean the response (sometimes LLMs wrap in markdown code blocks)
    const cleanedResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('Failed to parse LLM response:', responseText);
      return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
    }

    // Validate structure
    const validation = ReportSchema.safeParse(parsedResponse);
    if (!validation.success) {
       console.error('Validation error:', validation.error);
       return NextResponse.json({ error: 'Invalid LLM response format' }, { status: 500 });
    }
    
    const { sqlQuery, explanation, visualization } = validation.data;

    // Step 2: Validate SQL Safety
    if (!validateQuery(sqlQuery)) {
       return NextResponse.json({ error: 'Generated query failed safety check (read-only enforcement)' }, { status: 400 });
    }

    // Step 3: Execute Query
    let queryResult;
    try {
        // Drizzle's execute helper for raw SQL
        const res = await db.execute(sql.raw(sqlQuery));
        queryResult = res.rows;
    } catch (sqlError) {
        console.error('SQL Execution Error:', sqlError);
        return NextResponse.json({ error: 'Database execution failed', details: String(sqlError) }, { status: 500 });
    }

    // Step 4: Refine Visualization Data (Optional - usually LLM guess is ok, but we can verify keys exist)
    // For now, pass through to frontend.
    
    return NextResponse.json({
        data: queryResult,
        sql: sqlQuery,
        explanation,
        visualization
    });

  } catch (error: any) {
    console.error('API Error:', error);
    // Surface the actual error message for debugging purposes (e.g. 404 model not found)
    const errorMessage = error.message || 'Internal Server Error';
    return NextResponse.json({ error: `AI Generation Failed: ${errorMessage}` }, { status: 500 });
  }
}

