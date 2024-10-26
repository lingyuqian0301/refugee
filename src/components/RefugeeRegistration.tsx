"use client";

import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from "@chakra-ui/react";
import { ethers } from 'ethers';
import { getEthereumContract } from '../utils/ethereum';

interface RefugeeData {
  id: string;
  name: string;
  countryOfOrigin: string;
  dateOfBirth: string;
  isVerified: boolean;
  verifiedBy: string;
}

const generateUniqueId = (): string => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  return `R-${timestamp}-${randomNum}`;
};

const getUniqueId = (refugeeData: Omit<RefugeeData, 'id' | 'isVerified' | 'verifiedBy'>): string => {
  return generateUniqueId();
};

const RefugeeRegistration: React.FC = () => {
  const [refugeeData, setRefugeeData] = useState<RefugeeData>({
    id: '',
    name: '',
    countryOfOrigin: '',
    dateOfBirth: '',
    isVerified: false,
    verifiedBy: '',
  });
  const [connectedAddress, setConnectedAddress] = useState('');
  const toast = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRefugeeData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setConnectedAddress(address);
      toast({
        title: "Wallet Connected",
        description: `Connected with address: ${address}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRegistration = async () => {
    if (!connectedAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      // Generate unique ID locally
      const uniqueId = getUniqueId({
        name: refugeeData.name,
        countryOfOrigin: refugeeData.countryOfOrigin,
        dateOfBirth: refugeeData.dateOfBirth,
      });

      // Update refugeeData with the new ID
      setRefugeeData(prevData => ({ ...prevData, id: uniqueId }));

      const contract = await getEthereumContract('refugeeIdentity');
      if (!contract) {
        throw new Error("Failed to get Ethereum contract");
      }
      console.log("Contract instance:", contract);

      if (!contract.registerRefugee) {
        throw new Error("registerRefugee function not found on contract");
      }
      
      const tx = await contract.registerRefugee(
        uniqueId,
        refugeeData.name,
        refugeeData.countryOfOrigin,
        Math.floor(new Date(refugeeData.dateOfBirth).getTime() / 1000)
      );
      console.log("Transaction:", tx);
      
      if (!tx || !tx.wait) {
        throw new Error("Invalid transaction object");
      }

      await tx.wait();
      console.log("Transaction mined");

      toast({
        title: "Registration Submitted",
        description: `Refugee ${refugeeData.name} has been registered with ID: ${uniqueId}. Awaiting verification.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Clear the form after successful registration
      setRefugeeData({
        id: '',
        name: '',
        countryOfOrigin: '',
        dateOfBirth: '',
        isVerified: false,
        verifiedBy: ''
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Box>
        {!connectedAddress ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <Text>Connected: {connectedAddress}</Text>
        )}
      </Box>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input name="name" value={refugeeData.name} onChange={handleInputChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Country of Origin</FormLabel>
        <Input name="countryOfOrigin" value={refugeeData.countryOfOrigin} onChange={handleInputChange} />
      </FormControl>
      <FormControl>
        <FormLabel>Date of Birth</FormLabel>
        <Input name="dateOfBirth" type="date" value={refugeeData.dateOfBirth} onChange={handleInputChange} />
      </FormControl>
      <Button onClick={handleRegistration} isDisabled={!connectedAddress}>Register Refugee</Button>
    </VStack>
  );
};

export default RefugeeRegistration;
