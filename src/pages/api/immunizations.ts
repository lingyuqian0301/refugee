import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

const IMMUNIZATIONS_FILE = path.join(process.cwd(), 'data', 'immunizations.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Ensure data directory exists
        const dataDir = path.join(process.cwd(), 'data');
        await fs.mkdir(dataDir, { recursive: true });

        // Create file if it doesn't exist
        try {
            await fs.access(IMMUNIZATIONS_FILE);
        } catch {
            await fs.writeFile(IMMUNIZATIONS_FILE, '[]');
        }

        if (req.method === 'POST') {
            // Read existing immunization records
            const fileContent = await fs.readFile(IMMUNIZATIONS_FILE, 'utf8');
            const immunizations = JSON.parse(fileContent);

            // Add new immunization record
            const newImmunization = {
                id: `IR${Date.now()}`,
                ...req.body,
                createdAt: new Date().toISOString()
            };

            immunizations.push(newImmunization);

            // Save updated immunizations
            await fs.writeFile(IMMUNIZATIONS_FILE, JSON.stringify(immunizations, null, 2));

            return res.status(200).json(newImmunization);
        }

        if (req.method === 'GET') {
            const fileContent = await fs.readFile(IMMUNIZATIONS_FILE, 'utf8');
            const immunizations = JSON.parse(fileContent);
            return res.status(200).json(immunizations);
        }

        return res.status(405).json({ message: 'Method not allowed' });

    } catch (error) {
        console.error('Error handling immunization:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}