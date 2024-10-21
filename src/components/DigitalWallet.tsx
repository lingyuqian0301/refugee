"use client";

import React from 'react';
import { Box, Text, HStack, VStack, Icon, Button, Divider } from '@chakra-ui/react';
import { FaWallet, FaBitcoin, FaExchangeAlt } from 'react-icons/fa';

export default function DigitalWallet() {
  const walletData = {
    balance: "0.28 ETH",
    walletId: "0x1234...abcd",  // Example wallet ID for transfers
    recentTransactions: [
      { id: 1, description: 'Aid distribution received', amount: '0.05 ETH', date: '2024-10-20' },
      { id: 2, description: 'Job payment received', amount: '0.2 ETH', date: '2024-10-18' },
    ],
  };

  const handleTransfer = () => {
    alert('Transfer functionality coming soon!');  // Placeholder for future transfer functionality
  };

  return (
    <Box p={5} bg="gray.100" rounded="md" shadow="md">
      <HStack justify="space-between" align="center" spacing={8}>
        {/* Balance Section */}
        <VStack align="start" spacing={0}>
          <HStack>
            <Icon as={FaWallet} w={8} h={8} color="green.500" />
            <VStack align="start" spacing={0}>
              <Text fontSize="lg" fontWeight="medium">Digital Wallet Balance</Text>
              <Text fontSize="2xl" color="green.500">{walletData.balance}</Text>
            </VStack>
          </HStack>
          {/* Display Wallet ID */}
          <Text fontSize="sm" color="gray.600">Wallet ID: {walletData.walletId}</Text>
          {/* Transfer Button */}
          <Button leftIcon={<FaExchangeAlt />} colorScheme="teal" size="sm" mt={2} onClick={handleTransfer}>
            Transfer
          </Button>
        </VStack>

        {/* Divider */}
        <Divider orientation="vertical" h="70px" />

        {/* Recent Transactions */}
        <VStack align="start" spacing={0}>
          <Text fontSize="lg" fontWeight="semibold">Recent Transactions</Text>
          <HStack spacing={6} overflowX="auto" py={2}>
            {walletData.recentTransactions.map((tx) => (
              <HStack key={tx.id} p={4} bg="white" rounded="lg" shadow="sm" minW="220px">
                <Icon as={FaBitcoin} w={6} h={6} color="blue.500" />
                <VStack align="start" spacing={1}>
                  <Text fontSize="md" fontWeight="medium">{tx.description}</Text>
                  <Text fontSize="sm" color="gray.500">{tx.amount} on {tx.date}</Text>
                </VStack>
              </HStack>
            ))}
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}
