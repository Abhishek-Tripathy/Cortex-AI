import { config } from 'dotenv';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

config({ path: '.env.local' });

const ReportSchema = z.object({
  sqlQuery: z.string(),
  explanation: z.string(),
  visualization: z.object({
    type: z.enum(['table', 'bar', 'line', 'pie', 'singleValue']),
    title: z.string(),
    xKey: z.string().optional(),
    yKey: z.string().optional(),
  }),
});

async function main() {
  const { generateText } = await import('../lib/llm-client');
  const { db } = await import('../db/index');
  const { validateQuery } = await import('../lib/sql-guardrails');
  const { getSchemaContext } = await import('../lib/schema-context');

  const question = "count total actors";
  console.log(`Testing Question: "${question}"`);

  const schemaContext = getSchemaContext();
  
  const prompt = `
    You are an expert Data Analyst using PostgreSQL.
    Context:
    ${schemaContext}
    User Question: "${question}"
    Instructions:
    1. Generate a read-only PostgreSQL query.
    2. Choose visualization.
    3. Return ONLY JSON.
    {
      "sqlQuery": "SELECT ...",
      "explanation": "Brief description",
      "visualization": {
        "type": "table" | "bar" | "line" | "pie" | "singleValue",
        "title": "Chart Title",
        "xKey": "x",
        "yKey": "y"
      }
    }
    `;

  try {
    console.log('Generating content with REAL Model...');
    const text = await generateText(prompt);
    console.log('LLM Raw Response:', text);

    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    const validation = ReportSchema.safeParse(parsed);
    if (!validation.success) {
      console.error('Validation Failed:', validation.error);
      return;
    }
    
    console.log('SQL Generated:', validation.data.sqlQuery);

    if (!validateQuery(validation.data.sqlQuery)) {
      console.error('Guardrails Failed');
      return;
    }

    console.log('Executing Query...');
    const dbRes = await db.execute(sql.raw(validation.data.sqlQuery));
    console.log('Query Result:', dbRes.rows);

    console.log('SUCCESS: Full flow verified.');
  } catch (err) {
    console.error('Test Failed:', err);
  }
  
  process.exit(0);
}

main();
