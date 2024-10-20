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
}

const RefugeeRegistration: React.FC = () => {
  const [refugeeData, setRefugeeData] = useState<RefugeeData>({
    id: '',
    name: '',
    countryOfOrigin: '',
    dateOfBirth: '',
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
      const contract = await getEthereumContract('refugeeIdentity');
      const tx = await contract.registerRefugee(
        refugeeData.id,
        refugeeData.name,
        refugeeData.countryOfOrigin,
        Math.floor(new Date(refugeeData.dateOfBirth).getTime() / 1000)
      );
      await tx.wait();
      toast({
        title: "Registration Successful",
        description: `Refugee ${refugeeData.name} has been registered.`,
        status: "success",
        duration: 5000,
        isClosable: true,
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
