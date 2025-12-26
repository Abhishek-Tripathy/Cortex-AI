import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/llm-client';

export async function POST(req: NextRequest) {
  try {
    const { question, results } = await req.json();

    if (!results || !Array.isArray(results)) {
      return NextResponse.json({ error: 'Results array is required for analysis' }, { status: 400 });
    }

    // Prepare context for LLM (truncated if too large)
    const contextData = results.map((r: any, index: number) => {
        const rows = r.data;
        const sample = rows.length > 10 ? rows.slice(0, 10) : rows;
        return `Result ${index} (Query: ${r.query}):\nColumns: ${rows.length > 0 ? Object.keys(rows[0]).join(', ') : 'N/A'}\nSample Data: ${JSON.stringify(sample)}`;
    }).join('\n\n---\n\n');

    const analysisPrompt = `
    You are a Data Analyst creating a professional MIS dashboard.
    
    User Question: "${question}"
    
    Execution Results:
    ${contextData}

    TASK:
    1. Write a concise "Executive Summary" (2-3 sentences).
    2. For EACH result, decide the BEST visualization:
       - "singleValue": For single metrics (e.g., total count, total revenue). 
       - "bar" or "line" or "pie": For distributions/trends.
       - "table": For detailed multi-column data.
    3. EMBED the actual data in each visualization object. Do NOT use dataSourceIndex. Include the FULL data array.

    RETURN THIS EXACT JSON STRUCTURE:
    {
      "explanation": "Executive summary...",
      "visualizations": [
        {
          "type": "singleValue",
          "title": "Total Revenue",
          "value": "$67,416.51",
          "label": "All Time Revenue"
        },
        {
          "type": "bar",
          "title": "Films by Category",
          "xKey": "category",
          "yKey": "count",
          "data": [
            { "category": "Action", "count": 64 },
            { "category": "Comedy", "count": 58 }
          ]
        },
        {
          "type": "table",
          "title": "Top 10 Films",
          "columns": ["title", "revenue", "rentals"],
          "data": [
            { "title": "Film A", "revenue": "$500", "rentals": 50 }
          ]
        }
      ]
    }

    CRITICAL RULES:
    - Each visualization MUST contain its own "data" array (for bar/line/pie/table) OR "value"/"label" (for singleValue).
    - Do NOT reference dataSourceIndex anymore.
    - Limit table data to 20 rows max.
    - Format numbers nicely (e.g., "$1,234.56" for money).
    `;

    console.log('Stage 3: Analyzing result...');
    const text = await generateText(analysisPrompt);
    
    // Improved JSON extraction
    let cleaned = text.trim();
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
        cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
    
    const result = JSON.parse(cleaned);

    // Fallback if LLM returns old format with dataSourceIndex
    if (result.visualizations) {
        result.visualizations = result.visualizations.map((viz: any, idx: number) => {
            // If still using old dataSourceIndex, embed data
            if (viz.dataSourceIndex !== undefined && !viz.data && !viz.value) {
                const srcResult = results[viz.dataSourceIndex];
                if (srcResult) {
                    viz.data = srcResult.data.slice(0, 20); // Limit to 20 rows
                }
                delete viz.dataSourceIndex;
            }
            return viz;
        });
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Stage 3 Error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
