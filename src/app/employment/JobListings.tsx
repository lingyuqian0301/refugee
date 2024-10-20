import React from 'react';
import { VStack, Box, Heading, Text, Button, Input, HStack } from "@chakra-ui/react";

const JobListings: React.FC = () => {
  // Mock job data
  const jobs = [
    { id: 1, title: "Software Developer", company: "Tech Co", location: "Remote" },
    { id: 2, title: "Data Analyst", company: "Data Corp", location: "New York" },
    // Add more mock jobs as needed
  ];

  return (
    <VStack spacing={6} align="stretch">
      <HStack>
        <Input placeholder="Search jobs..." />
        <Button colorScheme="blue">Search</Button>
      </HStack>
      
      {jobs.map(job => (
        <Box key={job.id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
          <Heading size="md">{job.title}</Heading>
          <Text>{job.company} - {job.location}</Text>
          <Button mt={2} size="sm" colorScheme="blue">Apply</Button>
        </Box>
      ))}
    </VStack>
  );
};

export default JobListings;
