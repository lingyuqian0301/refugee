"use client";

import React, { useState } from 'react';
import { getEthereumContract } from '../utils/ethereum';

interface RefugeeData {
  id: string;
  name: string;
  countryOfOrigin: string;
  dateOfBirth: string;
}

const RefugeeRegistration: React.FC = () => {
  const [refugeeData, setRefugeeData] = useState<RefugeeData>({
    id: '',
    name: '',
    countryOfOrigin: '',
    dateOfBirth: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRefugeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const generateRefugeeId = () => {
    const countryCode = refugeeData.countryOfOrigin.slice(0, 2).toUpperCase();
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const sequenceNumber = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    
    return `${countryCode}-${year}-${month}-${sequenceNumber}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const contract = await getEthereumContract();
      const generatedId = generateRefugeeId();
      const dateOfBirth = new Date(refugeeData.dateOfBirth).getTime() / 1000; // Convert to Unix timestamp

      console.log('Attempting to register refugee with data:', {
        id: generatedId,
        name: refugeeData.name,
        countryOfOrigin: refugeeData.countryOfOrigin,
        dateOfBirth: dateOfBirth
      });

      const tx = await contract.registerRefugee(
        generatedId,
        refugeeData.name,
        refugeeData.countryOfOrigin,
        dateOfBirth
      );

      console.log('Transaction sent:', tx.hash);

      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.transactionHash);

      setRefugeeData((prevData) => ({
        ...prevData,
        id: generatedId,
      }));

      console.log('Refugee registered:', { ...refugeeData, id: generatedId });
    } catch (err) {
      console.error('Detailed error:', err);
      if (err.code === 'ACTION_REJECTED') {
        setError('Transaction was rejected by the user.');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        setError('Insufficient funds to complete the transaction.');
      } else {
        setError(`Failed to register refugee: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Refugee Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={refugeeData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="countryOfOrigin" className="block mb-1">Country of Origin</label>
          <input
            type="text"
            id="countryOfOrigin"
            name="countryOfOrigin"
            value={refugeeData.countryOfOrigin}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className="block mb-1">Date of Birth</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={refugeeData.dateOfBirth}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {refugeeData.id && (
        <div className="mt-5">
          <h3 className="font-bold">Generated Refugee ID:</h3>
          <p className="text-lg">{refugeeData.id}</p>
        </div>
      )}
    </div>
  );
};

export default RefugeeRegistration;
