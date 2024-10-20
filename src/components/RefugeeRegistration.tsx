"use client";

import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from "@chakra-ui/react";
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
  const toast = useToast();

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

    try {
      const contract = await getEthereumContract();
      const generatedId = generateRefugeeId();
      const dateOfBirth = new Date(refugeeData.dateOfBirth).getTime() / 1000;

      const tx = await contract.registerRefugee(
        generatedId,
        refugeeData.name,
        refugeeData.countryOfOrigin,
        dateOfBirth
      );

      await tx.wait();

      setRefugeeData((prevData) => ({
        ...prevData,
        id: generatedId,
      }));

      toast({
        title: "Refugee Registered",
        description: `ID: ${generatedId}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error('Detailed error:', err);
      toast({
        title: "Registration Failed",
        description: err.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box maxW="md" w="full" bg="white" p={6} borderRadius="lg" boxShadow="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={refugeeData.name}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Country of Origin</FormLabel>
            <Input
              name="countryOfOrigin"
              value={refugeeData.countryOfOrigin}
              onChange={handleInputChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Date of Birth</FormLabel>
            <Input
              type="date"
              name="dateOfBirth"
              value={refugeeData.dateOfBirth}
              onChange={handleInputChange}
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Registering"
            width="full"
          >
            Register
          </Button>
        </VStack>
      </form>
      {refugeeData.id && (
        <Box mt={4}>
          <Text fontWeight="bold">Generated Refugee ID:</Text>
          <Text>{refugeeData.id}</Text>
        </Box>
      )}
    </Box>
  );
};

export default RefugeeRegistration;
