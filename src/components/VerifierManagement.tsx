import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, Text, useToast } from "@chakra-ui/react";
import { getEthereumContract } from '../utils/ethereum';
import { ethers } from 'ethers';

const VerifierManagement: React.FC = () => {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [verifierAddress, setVerifierAddress] = useState('');
  const toast = useToast();

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

  const addVerifier = async () => {
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
      const tx = await contract.addAuthorizedVerifier(verifierAddress);
      await tx.wait();

      toast({
        title: "Verifier Added",
        description: `Address ${verifierAddress} has been added as an authorized verifier.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setVerifierAddress('');
    } catch (error) {
      console.error("Error adding verifier:", error);
      toast({
        title: "Failed to Add Verifier",
        description: error.message || "An error occurred while adding the verifier.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const removeVerifier = async () => {
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
      const tx = await contract.removeAuthorizedVerifier(verifierAddress);
      await tx.wait();

      toast({
        title: "Verifier Removed",
        description: `Address ${verifierAddress} has been removed as an authorized verifier.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setVerifierAddress('');
    } catch (error) {
      console.error("Error removing verifier:", error);
      toast({
        title: "Failed to Remove Verifier",
        description: error.message || "An error occurred while removing the verifier.",
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
        <FormLabel>Verifier Address</FormLabel>
        <Input value={verifierAddress} onChange={(e) => setVerifierAddress(e.target.value)} />
      </FormControl>
      <Button onClick={addVerifier} isDisabled={!connectedAddress}>Add Verifier</Button>
      <Button onClick={removeVerifier} isDisabled={!connectedAddress}>Remove Verifier</Button>
    </VStack>
  );
};

export default VerifierManagement;
