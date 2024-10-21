import React from 'react';
import { Box, Text, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import { FaUser, FaBriefcase, FaHandsHelping, FaCalendarAlt } from 'react-icons/fa';

export default function OverviewPanel() {
  return (
    <Box p={4} bg="gray.100" rounded="md" shadow="md">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Overview
      </Text>
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {/* Reputation Score */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaUser color="green" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Reputation Score</Text>
              <Text fontSize="2xl" color="green.500">85%</Text>
              <Text fontSize="xs" color="gray.500">Based on community feedback</Text>
            </VStack>
          </HStack>
        </GridItem>

        {/* Job Matches */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaBriefcase color="blue" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Job Matches</Text>
              <Text fontSize="2xl" color="blue.500">3 New Matches</Text>
              <Text fontSize="xs" color="gray.500">Last checked: 1 day ago</Text>
            </VStack>
          </HStack>
        </GridItem>

        {/* Aid Applications */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaHandsHelping color="red" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Aid Applications</Text>
              <Text fontSize="2xl" color="red.500">2 Pending</Text>
              <Text fontSize="xs" color="gray.500">Status: Awaiting approval</Text>
            </VStack>
          </HStack>
        </GridItem>

        {/* Medical Appointments */}
        <GridItem w="100%" p={4} bg="white" rounded="lg" shadow="sm">
          <HStack spacing={3}>
            <FaCalendarAlt color="purple" size="24px" />
            <VStack align="start">
              <Text fontSize="md" fontWeight="medium">Medical Appointments</Text>
              <Text fontSize="2xl" color="purple.500">Next: Oct 25</Text>
              <Text fontSize="xs" color="gray.500">Checkup with Dr. Smith</Text>
            </VStack>
          </HStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
