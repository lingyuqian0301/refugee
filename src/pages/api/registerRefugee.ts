import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { getEthereumContract } from '../../src/utils/ethereum';

// Function to generate a unique ID
function generateUniqueId(): string {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `R-${timestamp}-${randomNum}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { name, countryOfOrigin, dateOfBirth } = req.body;

      // Generate a unique ID
      const uniqueId = generateUniqueId();

      // Get the contract instance
      const contract = await getEthereumContract('refugeeIdentity');

      // Call the contract's registerRefugee function
      const tx = await contract.registerRefugee(
        uniqueId,
        name,
        countryOfOrigin,
        Math.floor(new Date(dateOfBirth).getTime() / 1000)
      );

      // Wait for the transaction to be mined
      await tx.wait();

      res.status(200).json({ success: true, id: uniqueId, message: 'Refugee registered successfully' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
