import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

// Using Gemini 2.0 Flash for high speed and reasoning
// Note: "gemini-2.5-flash" requested by user, mapping to available robust model "gemini-2.0-flash-exp" or standard flash if preferred.
// Assuming "gemini-2.0-flash-exp" is the intended bleeding edge flash model or fallback to 1.5-flash.
// Let's use 'gemini-2.0-flash-exp' as it's the current state-of-the-art fast model from Google.
export const MODEL_NAME = 'gemini-2.5-flash';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

export async function generateText(prompt: string): Promise<string> {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
        throw new Error('Empty response from Gemini API');
    }
    
    return text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
}
