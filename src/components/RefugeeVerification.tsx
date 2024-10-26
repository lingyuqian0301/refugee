// refugee/src/components/RefugeeVerification.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
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

interface RegisteredRefugee {
  id: string;
  registeredBy: string;
}

const RefugeeVerification: React.FC = () => {
  const [refugeeId, setRefugeeId] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [verifiedIds, setVerifiedIds] = useState<RefugeeEvent[]>([]);
  const [refugeeInfo, setRefugeeInfo] = useState<Refugee | null>(null);
  const [registeredRefugees, setRegisteredRefugees] = useState<RegisteredRefugee[]>([]);
  const [allRefugees, setAllRefugees] = useState<(Refugee & { id: string })[]>([]);
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

  const fetchAllRefugees = async () => {
    try {
      const contract = await getEthereumContract('refugeeIdentity');
      const filter = contract.filters.RefugeeRegistered();
      const events = await contract.queryFilter(filter);
      const refugees = await Promise.all(events.map(async (event) => {
        const id = event.args?.id;
        const info = await contract.getRefugee(id);
        return {
          id,
          name: info.name,
          countryOfOrigin: info.countryOfOrigin,
          dateOfBirth: Number(info.dateOfBirth),
          isVerified: info.isVerified,
          registeredBy: info.registeredBy,
          verifiedBy: info.verifiedBy
        };
      }));
      setAllRefugees(refugees);
      console.log("Fetched all refugees:", refugees);
    } catch (error) {
      console.error("Error fetching all refugees:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch refugee information. Please try again later.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (connectedAddress) {
      fetchAllRefugees();
    }
  }, [connectedAddress]);

  const handleVerification = async (id: string) => {
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
      const tx = await contract.verifyRefugee(id);
      await tx.wait();

      toast({
        title: "Verification Successful",
        description: `Refugee with ID ${id} has been verified.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchAllRefugees();
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
      
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Name</Th>
            <Th>Country of Origin</Th>
            <Th>Date of Birth</Th>
            <Th>Verified</Th>
            <Th>Registered By</Th>
            <Th>Verified By</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {allRefugees.map((refugee) => (
            <Tr key={refugee.id}>
              <Td>{refugee.id}</Td>
              <Td>{refugee.name}</Td>
              <Td>{refugee.countryOfOrigin}</Td>
              <Td>{new Date(refugee.dateOfBirth * 1000).toLocaleDateString()}</Td>
              <Td>{refugee.isVerified ? 'Yes' : 'No'}</Td>
              <Td>{refugee.registeredBy}</Td>
              <Td>{refugee.verifiedBy || 'N/A'}</Td>
              <Td>
                {!refugee.isVerified && (
                  <Button onClick={() => handleVerification(refugee.id)} size="sm">
                    Verify
                  </Button>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      
      <Button onClick={fetchAllRefugees}>Refresh Refugee Data</Button>
    </VStack>
  );
};

export default RefugeeVerification;
