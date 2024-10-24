import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set');
}

const openai = new OpenAI(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

async function generatePrompts(engine, prompt) {
  const response = await openai.createCompletion({
    engine: engine,
    prompt: prompt,
    max_tokens: 512,
    temperature: 0.5
  });
  
  return response.choices[0].text.trim();
}