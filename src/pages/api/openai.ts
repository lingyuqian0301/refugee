import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set');
}

if (!process.env.MENTAL_HEALTH_ASSISTANCE_ID) {
    console.error('MENTAL_HEALTH_ASSISTANT_ID is not set');
}   

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Load assistant
const assistantId = process.env.MENTAL_HEALTH_ASSISTANCE_ID || '';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { inputMessage, threadId } = req.body;

    if (!inputMessage) {
        return res.status(400).json({ error: 'Input message is required' });
    }

    try {
        // Create or retrieve the thread
        let thread;
        if (threadId) {
            thread = await openai.beta.threads.retrieve(threadId);
        } else {
            thread = await openai.beta.threads.create();
        }

        // Add the user message to the thread
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: inputMessage,
        });

        // Run the assistant on the thread
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Wait for the run to complete
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== 'completed') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        // Retrieve the assistant's messages
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');

        return res.status(200).json({ response: assistantMessage?.content[0].text.value });
    } catch (error) {
        console.error('Error sending message to bot:', error);
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}