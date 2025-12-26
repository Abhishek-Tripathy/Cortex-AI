import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/llm-client';
import { getSchemaContext } from '@/lib/schema-context';

export async function POST(req: NextRequest) {
  try {
    const { question } = await req.json();

    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const schemaContext = getSchemaContext();
    
    // Strict prompt to return JSON array of SQL queries
    const systemPrompt = `
    You are an expert Data Analyst using PostgreSQL.
    
    Context:
    ${schemaContext}
    
    Instructions:
    1. Generate read-only PostgreSQL query(ies) to answer the user's question.
    2. If the question requires multiple data points (like an MIS report), generate MULTIPLE queries.
    3. RETURN ONLY A JSON OBJECT with the following structure:
       {
         "sqlQueries": [ "SELECT column1, column2 FROM table1", "SELECT column3 FROM table2" ]
       }
    4. CRITICAL FORMAT RULES:
       - Each query in sqlQueries MUST be a SINGLE STRING, NOT an array of lines.
       - WRONG: ["SELECT", "column1", "FROM table"] 
       - CORRECT: "SELECT column1 FROM table"
       - Use 'activebool' (boolean) for customer active status.
       - Do not include trailing semicolons.
    `;

    const fullPrompt = `${systemPrompt}\n\nUser Question: "${question}"\n\nJSON:`;

    console.log('Stage 1: Generating SQL...');
    const text = await generateText(fullPrompt);
    
    // Improved JSON extraction: find the first '{' and the last '}'
    let cleaned = text.trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    let result;
    try {
        result = JSON.parse(cleaned);
        if (!result.sqlQueries || !Array.isArray(result.sqlQueries)) {
             if (typeof result.sqlQueries === 'string') {
                 result.sqlQueries = [result.sqlQueries];
             } else {
                 throw new Error('Invalid format');
             }
        }
        
        // NORMALIZATION: If LLM returns arrays of lines instead of strings, join them
        result.sqlQueries = result.sqlQueries.map((q: any) => {
            if (Array.isArray(q)) {
                return q.join(' ');
            }
            return q;
        });
        
    } catch (e) {
        console.error('JSON Parse failed:', e);
        console.error('Raw Text:', text);
        return NextResponse.json({ error: 'Failed to parse AI response. Please try again.' }, { status: 500 });
    }
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Stage 1 Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate SQL' }, { status: 500 });
  }
}
