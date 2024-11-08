import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const APPOINTMENTS_FILE = path.join(process.cwd(), 'data', 'appointments.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        await fs.mkdir(dataDir, { recursive: true });

        // Create file if it doesn't exist
        try {
            await fs.access(APPOINTMENTS_FILE);
        } catch {
            await fs.writeFile(APPOINTMENTS_FILE, '[]');
        }

        if (req.method === 'POST') {
            // Read existing appointments
            const fileContent = await fs.readFile(APPOINTMENTS_FILE, 'utf8');
            const appointments = JSON.parse(fileContent);

            // Add new appointment
            const newAppointment = {
                id: Date.now(),
                ...req.body,
                createdAt: new Date().toISOString()
            };

            appointments.push(newAppointment);

            // Save updated appointments
            await fs.writeFile(APPOINTMENTS_FILE, JSON.stringify(appointments, null, 2));

            return res.status(200).json(newAppointment);
        }

        if (req.method === 'GET') {
            const fileContent = await fs.readFile(APPOINTMENTS_FILE, 'utf8');
            const appointments = JSON.parse(fileContent);
            return res.status(200).json(appointments);
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error) {
        console.error('Error handling appointment:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}