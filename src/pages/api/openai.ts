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

const systemMessage = `You are an empathetic mental health support assistant specifically trained to help refugees. Your role is to:
- Provide emotional support and understanding
- Offer basic coping strategies for stress, anxiety, and trauma
- Recognize signs of serious mental health concerns and recommend professional help
- Be culturally sensitive and acknowledge the unique challenges refugees face
- Keep responses concise, clear, and supportive
- When medical attention is needed, provide hospital information in Penang

Remember: You are not a replacement for professional mental health care. For serious concerns, always encourage seeking professional help.`;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// Load assistant
const assistantId = process.env.MENTAL_HEALTH_ASSISTANCE_ID || '';


const parseResponse = (content: string) => {
    try {
        if (content.includes('HOSPITAL_INFO:')) {
            const [message, hospitalData] = content.split('HOSPITAL_INFO:');
            const hospitalInfo = JSON.parse(hospitalData);
            return {
                text: message.trim(),
                hospitalInfo: {
                    ...hospitalInfo,
                    appointmentLink: `/appointments/schedule?hospital=${encodeURIComponent(hospitalInfo.name)}`
                },
                actions: [{
                    type: 'appointment',
                    hospital: hospitalInfo.name,
                    link: `/appointments/schedule?hospital=${encodeURIComponent(hospitalInfo.name)}`
                }]
            };
        }
        return { text: content };
    } catch (error) {
        console.log('Error parsing response:', error);
        return { text: content };
    }
};



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
            console.log('Using existing thread:', threadId);
            thread = await openai.beta.threads.retrieve(threadId);
        } else {
            console.log('Creating new thread');
            thread = await openai.beta.threads.create();
        }

        // Add the user message to the thread
        console.log('Adding message to thread:', inputMessage);
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: inputMessage,
        });

        // Run the assistant on the thread
        console.log('Starting assistant run with ID:', assistantId);
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId,
        });

        // Wait for the run to complete
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        while (runStatus.status !== 'completed') {
            console.log('Run status:', runStatus.status);
            await new Promise(resolve => setTimeout(resolve, 1000));
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
        }

        // Retrieve the assistant's messages
        console.log('Retrieving assistant messages');
        const messages = await openai.beta.threads.messages.list(thread.id);
        const assistantMessage = messages.data.find(msg => msg.role === 'assistant');
        console.log('Assistant message:', assistantMessage);
        const parsedResponse = parseResponse(assistantMessage?.content[0].text.value || '');
        console.log('Parsed response:', parsedResponse);

        return res.status(200).json(parsedResponse);
    } catch (error) {
        console.error('Error sending message to bot:', error);
        console.log('Full error object:', JSON.stringify(error, null, 2));
        return res.status(500).json({ error: 'Error fetching response from OpenAI' });
    }
}