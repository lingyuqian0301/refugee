import React from 'react';
import { VStack, Box, Heading, Text, Badge, Button } from "@chakra-ui/react";

const ApplicationManagement: React.FC = () => {
  // Mock application data
  const applications = [
    { id: 1, jobTitle: "Software Developer", company: "Tech Co", status: "Pending" },
    { id: 2, jobTitle: "Data Analyst", company: "Data Corp", status: "Interview" },
    // Add more mock applications as needed
  ];

  return (
    <VStack spacing={6} align="stretch">
      {applications.map(app => (
        <Box key={app.id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
          <Heading size="md">{app.jobTitle}</Heading>
          <Text>{app.company}</Text>
          <Badge colorScheme={app.status === "Pending" ? "yellow" : "green"}>{app.status}</Badge>
          <Button mt={2} size="sm" colorScheme="blue">View Details</Button>
        </Box>
      ))}
    </VStack>
  );
};

export default ApplicationManagement;
