import React from 'react';
import { Box, Heading, VStack } from "@chakra-ui/react";
import RefugeeRegistration from '../components/RefugeeRegistration';
import RefugeeVerification from '../components/RefugeeVerification';
import VerifierManagement from '../components/VerifierManagement';

const Home: React.FC = () => {
  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading as="h1" size="xl">Refugee Identity Management</Heading>
        
        <Box>
          <Heading as="h2" size="lg">Refugee Registration</Heading>
          <RefugeeRegistration />
        </Box>
        
        <Box>
          <Heading as="h2" size="lg">Refugee Verification</Heading>
          <RefugeeVerification />
        </Box>
        
        <Box>
          <Heading as="h2" size="lg">Verifier Management</Heading>
          <VerifierManagement />
        </Box>
      </VStack>
    </Box>
  );
};

export default Home;
