"use client";

import React, { useState } from 'react';
import { Box, Heading, Text, VStack, HStack, Button, Input, useToast, Image, Grid, GridItem } from "@chakra-ui/react";
import { FaHandHoldingHeart, FaSchool, FaUtensils, FaHome } from "react-icons/fa";
import DigitalWallet from '../../components/DigitalWallet';
import DefaultLayout from "../../components/Layouts/DefaultLaout";

const aidFunds = [
  { 
    id: 1, 
    name: "Emergency Relief Fund", 
    description: "Provides immediate assistance for food, water, and basic necessities.",
    icon: FaHandHoldingHeart,
    color: "red.500"
  },
  { 
    id: 2, 
    name: "Education Support", 
    description: "Helps refugee children access education and school supplies.",
    icon: FaSchool,
    color: "blue.500"
  },
  { 
    id: 3, 
    name: "Food Security Program", 
    description: "Ensures regular meals and nutritional support for families.",
    icon: FaUtensils,
    color: "green.500"
  },
  { 
    id: 4, 
    name: "Shelter Assistance", 
    description: "Provides temporary housing and shelter improvement.",
    icon: FaHome,
    color: "orange.500"
  },
];

const sponsors = [
  { name: "UNHCR", logo: "/images/sponsors/unhcr-logo.png" },
  { name: "Red Cross", logo: "/images/sponsors/red-cross-logo.jpeg" },
  { name: "UNICEF", logo: "/images/sponsors/unicef-logo.jpg" },
  { name: "World Food Programme", logo: "/images/sponsors/wfp-logo.jpg" },
  { name: "Malaysian Government", logo: "/images/sponsors/malaysia-gov-logo.png" },
];

export default function AidPage() {
  const [selectedFund, setSelectedFund] = useState(null);
  const [amount, setAmount] = useState('');
  const toast = useToast();

  const handleTransfer = async () => {
    if (!selectedFund || !amount) {
      toast({
        title: "Error",
        description: "Please select a fund and enter an amount.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Here you would typically interact with a smart contract to transfer funds
    // For demonstration, we'll just show a success message
    toast({
      title: "Request Submitted",
      description: `Your request for ${amount} ETH from ${selectedFund.name} has been submitted for approval.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    setSelectedFund(null);
    setAmount('');
  };

  return (
    <DefaultLayout>
      <Grid templateColumns="1fr 300px" gap={8} p={8}>
        <GridItem>
          <Heading mb={6}>Refugee Aid Programs</Heading>
          <Text mb={4}>Select an aid program to request assistance:</Text>
          
          <VStack spacing={4} align="stretch" mb={8}>
            {aidFunds.map(fund => (
              <Box 
                key={fund.id} 
                p={4} 
                borderWidth={1} 
                borderRadius="md" 
                cursor="pointer"
                bg={selectedFund?.id === fund.id ? "blue.50" : "white"}
                onClick={() => setSelectedFund(fund)}
                boxShadow="sm"
                _hover={{ boxShadow: "md" }}
              >
                <HStack>
                  <Box as={fund.icon} size="40px" color={fund.color} />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{fund.name}</Text>
                    <Text fontSize="sm">{fund.description}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          {selectedFund && (
            <VStack spacing={4} align="stretch" bg="gray.50" p={4} borderRadius="md">
              <Heading size="md">Request Aid from {selectedFund.name}</Heading>
              <HStack>
                <Input 
                  placeholder="Amount needed" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                />
                <Button colorScheme="blue" onClick={handleTransfer}>Submit Request</Button>
              </HStack>
              <Text fontSize="sm" color="gray.600">
                Your request will be reviewed by our team. Approved funds will be transferred to your digital wallet.
              </Text>
            </VStack>
          )}

          <Box mt={8}>
            <DigitalWallet />
          </Box>

          <Box mt={8} p={4} borderWidth={1} borderRadius="md" bg="gray.50">
            <Heading size="md" mb={4}>Need Help?</Heading>
            <Text mb={2}>If you need assistance with your aid application or have any questions, please contact our support team:</Text>
            <Text fontWeight="bold">Hotline: +60 1234567890</Text>
            <Text fontWeight="bold">Email: refugee.support@example.com</Text>
          </Box>
        </GridItem>

        <GridItem>
          <Box p={4} borderWidth={1} borderRadius="md" bg="gray.50">
            <Heading size="md" mb={4}>Our Sponsors</Heading>
            <Text mb={4}>In collaboration with:</Text>
            <VStack spacing={4} align="stretch">
              {sponsors.map((sponsor, index) => (
                <HStack key={index} spacing={4}>
                  <Image src={sponsor.logo} alt={`${sponsor.name} logo`} boxSize="50px" objectFit="contain" />
                  <Text fontWeight="bold">{sponsor.name}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </DefaultLayout>
  );
}
