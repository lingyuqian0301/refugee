"use client";

import React, { useState, useEffect } from 'react';
import { getEthereumContract } from '../utils/ethereum';
import { ethers } from 'ethers';

const RegisteredIDsBoard: React.FC = () => {
  const [registeredIDs, setRegisteredIDs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegisteredIDs = async () => {
      try {
        setIsLoading(true);
        const contract = await getEthereumContract();
        if (!contract) {
          throw new Error("Failed to initialize contract");
        }
        
        // Listen for past RefugeeRegistered events to get registered IDs
        const filter = contract.filters.RefugeeRegistered();
        const events = await contract.queryFilter(filter);
        
        const ids = events.map(event => event.args?.id).filter(Boolean);
        setRegisteredIDs(ids);
      } catch (err) {
        console.error('Error fetching registered IDs:', err);
        setError(`Failed to fetch registered IDs: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegisteredIDs();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Registered IDs</h2>
      {isLoading ? (
        <p>Loading registered IDs...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : registeredIDs.length === 0 ? (
        <p>No IDs have been registered yet.</p>
      ) : (
        <ul className="space-y-2">
          {registeredIDs.map((id, index) => (
            <li key={index} className="bg-gray-100 p-2 rounded">{id}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RegisteredIDsBoard;
