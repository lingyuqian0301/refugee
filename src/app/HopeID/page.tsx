"use client";

import React from 'react';
import { Box, Heading } from "@chakra-ui/react";
import VerifierManagement from '../../components/VerifierManagement';

const HopeIDPage: React.FC = () => {
  return (
    <Box p={4}>
      <Heading as="h1" mb={6}>HopeID Management</Heading>
      <VerifierManagement />
    </Box>
  );
};

export default HopeIDPage;
