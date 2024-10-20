import React, { useState } from 'react';
import { VStack, Box, Heading, Text, Badge, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, HStack, Divider } from "@chakra-ui/react";

const ApplicationManagement: React.FC = () => {
  // Mock application data
  const applications = [
    { id: 1, jobTitle: "Software Developer", company: "Tech Co", status: "Pending", description: "Develop web applications using React and Node.js", appliedDate: "2023-05-15" },
    { id: 2, jobTitle: "Data Analyst", company: "Data Corp", status: "Interview", description: "Analyze large datasets and create visualizations", appliedDate: "2023-05-10" },
    // Add more mock applications as needed
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const handleViewDetails = (app: any) => {
    setSelectedApp(app);
    onOpen();
  };

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg" mb={4}>My Applications</Heading>
      {applications.map(app => (
        <Box key={app.id} p={6} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white">
          <HStack justifyContent="space-between" alignItems="flex-start">
            <VStack align="start" spacing={2}>
              <Heading size="md">{app.jobTitle}</Heading>
              <Text fontSize="lg" color="gray.600">{app.company}</Text>
              <Badge colorScheme={app.status === "Pending" ? "yellow" : "green"} fontSize="sm" px={2} py={1} borderRadius="full">{app.status}</Badge>
            </VStack>
            <Button size="sm" colorScheme="blue" onClick={() => handleViewDetails(app)}>View Details</Button>
          </HStack>
        </Box>
      ))}

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl">{selectedApp?.jobTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>Company</Text>
                <Text>{selectedApp?.company}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>Status</Text>
                <Badge colorScheme={selectedApp?.status === "Pending" ? "yellow" : "green"}>{selectedApp?.status}</Badge>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>Description</Text>
                <Text>{selectedApp?.description}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>Applied Date</Text>
                <Text>{selectedApp?.appliedDate}</Text>
              </Box>
            </VStack>
          </ModalBody>
          <Divider my={4} />
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ApplicationManagement;
