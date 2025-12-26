
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';
config({ path: '.env.local' });

async function verify() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('ERROR: No GEMINI_API_KEY found in process.env');
    return;
  }

  console.log(`Key found: ${key.substring(0, 5)}...${key.substring(key.length - 4)}`);
  
  const genAI = new GoogleGenerativeAI(key);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  try {
    console.log('Attempting to generate content with gemini-1.5-flash...');
    const result = await model.generateContent('Test connection. Reply with "OK".');
    console.log('SUCCESS! Response:', result.response.text());
  } catch (err: any) {
    console.error('FAILED:', err.name, err.message);
    if (err.message.includes('404')) {
        console.log('404 Error: The key exists but cannot access this model.');
    }
  }
}

verify();
