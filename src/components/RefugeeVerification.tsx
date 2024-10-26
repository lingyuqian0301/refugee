// refugee/src/components/RefugeeVerification.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast, List, ListItem } from "@chakra-ui/react";
import { getEthereumContract } from '../utils/ethereum';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface RefugeeEvent {
  id: string;
  verifiedBy: string;
}

interface Refugee {
  name: string;
  countryOfOrigin: string;
  dateOfBirth: number;
  isVerified: boolean;
  registeredBy: string;
  verifiedBy: string;
}

const RefugeeVerification: React.FC = () => {
  const [refugeeId, setRefugeeId] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [verifiedIds, setVerifiedIds] = useState<RefugeeEvent[]>([]);
  const [refugeeInfo, setRefugeeInfo] = useState<Refugee | null>(null);
  const toast = useToast();

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
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

  const fetchVerifiedIds = async () => {
    try {
      const contract = await getEthereumContract('refugeeIdentity');
      const filter = contract.filters.RefugeeVerified();
      const events = await contract.queryFilter(filter);
      const verifiedEvents = events.map(event => ({
        id: event.args.id,
        verifiedBy: event.args.verifiedBy
      }));
      setVerifiedIds(verifiedEvents);
      console.log("Fetched verified IDs:", verifiedEvents);
    } catch (error) {
      console.error("Error fetching verified IDs:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch verified IDs. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchRefugeeInfo = async (id: string) => {
    try {
      const contract = await getEthereumContract('refugeeIdentity');
      const info = await contract.getRefugee(id);
      if (info.name === '') {
        throw new Error('Refugee not found');
      }
      setRefugeeInfo({
        name: info.name,
        countryOfOrigin: info.countryOfOrigin,
        dateOfBirth: Number(info.dateOfBirth),
        isVerified: info.isVerified,
        registeredBy: info.registeredBy,
        verifiedBy: info.verifiedBy
      });
      toast({
        title: "Refugee Info Fetched",
        description: `Found refugee: ${info.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching refugee info:", error);
      setRefugeeInfo(null);
      toast({
        title: "Fetch Failed",
        description: error instanceof Error ? error.message : "Failed to fetch refugee information.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (connectedAddress) {
      fetchVerifiedIds();
    }
  }, [connectedAddress]);

  const handleVerification = async () => {
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

    if (!refugeeInfo) {
      toast({
        title: "Refugee Info Not Fetched",
        description: "Please fetch refugee information first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (refugeeInfo.isVerified) {
      toast({
        title: "Already Verified",
        description: "This refugee has already been verified",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const contract = await getEthereumContract('refugeeIdentity');
      const tx = await contract.verifyRefugee(refugeeId);
      await tx.wait();

      toast({
        title: "Verification Successful",
        description: `Refugee ${refugeeInfo.name} with ID ${refugeeId} has been verified.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setRefugeeId('');
      setRefugeeInfo(null);
      fetchVerifiedIds();
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An error occurred during verification.",
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
        <FormLabel>Refugee ID</FormLabel>
        <Input value={refugeeId} onChange={(e) => setRefugeeId(e.target.value)} />
      </FormControl>
      <Button onClick={() => fetchRefugeeInfo(refugeeId)} isDisabled={!connectedAddress || !refugeeId}>
        Fetch Refugee Info
      </Button>
      
      {refugeeInfo && (
        <Box borderWidth={1} borderRadius="lg" p={4}>
          <Text><strong>Name:</strong> {refugeeInfo.name}</Text>
          <Text><strong>Country of Origin:</strong> {refugeeInfo.countryOfOrigin}</Text>
          <Text><strong>Date of Birth:</strong> {new Date(refugeeInfo.dateOfBirth * 1000).toLocaleDateString()}</Text>
          <Text><strong>Verified:</strong> {refugeeInfo.isVerified ? 'Yes' : 'No'}</Text>
          <Text><strong>Registered By:</strong> {refugeeInfo.registeredBy}</Text>
          {refugeeInfo.isVerified && <Text><strong>Verified By:</strong> {refugeeInfo.verifiedBy}</Text>}
        </Box>
      )}
      
      <Button 
        onClick={handleVerification} 
        isDisabled={!connectedAddress || !refugeeInfo || refugeeInfo.isVerified}
      >
        Verify Refugee
      </Button>
      
      <Box>
        <Text fontWeight="bold">Verified Refugee IDs:</Text>
        {verifiedIds.length > 0 ? (
          <List spacing={2}>
            {verifiedIds.map((event, index) => (
              <ListItem key={index}>
                ID: {event.id} - Verified by: {event.verifiedBy}
              </ListItem>
            ))}
          </List>
        ) : (
          <Text>No verified IDs found.</Text>
        )}
      </Box>
      <Button onClick={fetchVerifiedIds}>Refresh Verified IDs</Button>
    </VStack>
  );
};

export default RefugeeVerification;
