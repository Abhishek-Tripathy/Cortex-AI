
if (!process.env.ROUTEAWAY_API_KEY) {
  throw new Error('ROUTEAWAY_API_KEY is not set in environment variables');
}

export const MODEL_NAME = 'deepseek-v3.1-terminus:free';

export async function generateText(prompt: string): Promise<string> {
  const apiKey = process.env.ROUTEAWAY_API_KEY;
  
  const response = await fetch('https://api.routeway.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: [
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
     const errorText = await response.text();
     throw new Error(`RouteAway API Error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  // Ensure we handle the response structure correctly (OpenAI compatible)
  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from RouteAway API');
  }
  
  return data.choices[0].message.content;
}
