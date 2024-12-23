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

interface ExtendedRefugee extends Refugee {
  id: string;
  verificationInfo?: {
    isVerified: boolean;
    verifier: string;
    name: string;
  };
}

const RefugeeVerification: React.FC = () => {
  const [refugeeId, setRefugeeId] = useState('');
  const [connectedAddress, setConnectedAddress] = useState('');
  const [verifiedIds, setVerifiedIds] = useState<RefugeeEvent[]>([]);
  const [refugeeInfo, setRefugeeInfo] = useState<Refugee | null>(null);
  const [registeredRefugees, setRegisteredRefugees] = useState<RegisteredRefugee[]>([]);
  const [allRefugees, setAllRefugees] = useState<ExtendedRefugee[]>([]);
  const [isVerifier, setIsVerifier] = useState(false);
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

  const checkVerifierStatus = async () => {
    if (!connectedAddress) return;
    try {
      const verificationInfoContract = await getEthereumContract('refugeeVerificationInfo');
      const verifierStatus = await verificationInfoContract.isVerifier(connectedAddress);
      setIsVerifier(verifierStatus);
    } catch (error) {
      console.error("Error checking verifier status:", error);
    }
  };

  const fetchAllRefugees = async () => {
    try {
      const identityContract = await getEthereumContract('refugeeIdentity');
      const verificationInfoContract = await getEthereumContract('refugeeVerificationInfo');
      
      const filter = identityContract.filters.RefugeeRegistered();
      const events = await identityContract.queryFilter(filter);
      
      const refugees = await Promise.all(events.map(async (event) => {
        const id = event.args?.id;
        const identityInfo = await identityContract.getRefugee(id);
        
        // Get additional verification info
        const verificationInfo = await verificationInfoContract.getRefugeeVerificationStatus(id);
        
        return {
          id,
          name: identityInfo.name,
          countryOfOrigin: identityInfo.countryOfOrigin,
          dateOfBirth: Number(identityInfo.dateOfBirth),
          isVerified: identityInfo.isVerified,
          registeredBy: identityInfo.registeredBy,
          verifiedBy: identityInfo.verifiedBy,
          verificationInfo: {
            isVerified: verificationInfo.isVerified,
            verifier: verificationInfo.verifier,
            name: verificationInfo.name
          }
        };
      }));
      
      setAllRefugees(refugees);
    } catch (error) {
      console.error("Error fetching refugees:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch refugee information",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleVerification = async (id: string) => {
    if (!connectedAddress || !isVerifier) {
      toast({
        title: "Verification Failed",
        description: "You must be an authorized verifier",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const identityContract = await getEthereumContract('refugeeIdentity');
      const verificationInfoContract = await getEthereumContract('refugeeVerificationInfo');

      // Verify on both contracts
      const tx1 = await identityContract.verifyRefugee(id);
      await tx1.wait();

      const tx2 = await verificationInfoContract.verifyMultipleRefugees([id]);
      await tx2.wait();

      toast({
        title: "Verification Successful",
        description: `Refugee with ID ${id} has been verified`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      fetchAllRefugees();
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (connectedAddress) {
      checkVerifierStatus();
      fetchAllRefugees();
    }
  }, [connectedAddress]);

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
