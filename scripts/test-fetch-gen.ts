
import { config } from 'dotenv';
config({ path: '.env.local' });

async function testFetch() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('No API Key');
    return;
  }

  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{
      parts: [{ text: "Explain how AI works" }]
    }]
  };

  try {
    console.log(`Fetching ${url}...`);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.error('Error Status:', res.status, res.statusText);
      console.error('Error Body:', JSON.stringify(data, null, 2));
    } else {
      console.log('SUCCESS!');
      console.log('Response:', JSON.stringify(data.candidates[0].content.parts[0].text, null, 2));
    }

  } catch (err) {
    console.error('Fetch Failed:', err);
  }
}

testFetch();
