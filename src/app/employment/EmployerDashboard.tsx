import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Badge, Button, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, HStack, Divider, useColorModeValue
} from "@chakra-ui/react";

const EmployerDashboard: React.FC = () => {
  const [applications, setApplications] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    // In a real application, you would fetch this data from your backend
    const mockApplications = [
      { id: 1, name: "John Doe", jobTitle: "Cooker for Old Folk Home", status: "Pending", appliedDate: "2023-05-15", skills: ["Cooking", "Patience", "Empathy"] },
      { id: 2, name: "Jane Smith", jobTitle: "Cooker for Old Folk Home", status: "Pending", appliedDate: "2023-05-16", skills: ["Cooking", "Meal Planning", "Nutrition Knowledge"] },
      { id: 3, name: "Bob Johnson", jobTitle: "Cooker for Old Folk Home", status: "Pending", appliedDate: "2023-05-17", skills: ["Cooking", "Teamwork", "Time Management"] },
    ];
    setApplications(mockApplications);
  }, []);

  const handleViewDetails = (app) => {
    setSelectedApp(app);
    onOpen();
  };

  const handleUpdateStatus = (id, newStatus) => {
    setApplications(applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    onClose();
  };

  return (
    <Box p={8}>
      <Heading mb={6}>Applications for Old Folk Home</Heading>
      <Table variant="simple" bg={bgColor} borderWidth={1} borderColor={borderColor}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Applied Date</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {applications.map(app => (
            <Tr key={app.id}>
              <Td>{app.name}</Td>
              <Td>{app.appliedDate}</Td>
              <Td>
                <Badge colorScheme={app.status === "Pending" ? "yellow" : app.status === "Approved" ? "green" : "red"}>
                  {app.status}
                </Badge>
              </Td>
              <Td>
                <Button size="sm" colorScheme="blue" onClick={() => handleViewDetails(app)}>View Details</Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl">{selectedApp?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={1}>Job Title</Text>
                <Text>{selectedApp?.jobTitle}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>Applied Date</Text>
                <Text>{selectedApp?.appliedDate}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>Status</Text>
                <Badge colorScheme={selectedApp?.status === "Pending" ? "yellow" : selectedApp?.status === "Approved" ? "green" : "red"}>
                  {selectedApp?.status}
                </Badge>
              </Box>
              <Box>
                <Text fontWeight="bold" mb={1}>Skills</Text>
                <HStack>
                  {selectedApp?.skills.map((skill, index) => (
                    <Badge key={index} colorScheme="blue">{skill}</Badge>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </ModalBody>
          <Divider my={4} />
          <ModalFooter>
            <HStack spacing={4}>
              <Button colorScheme="green" onClick={() => handleUpdateStatus(selectedApp.id, "Approved")}>
                Approve
              </Button>
              <Button colorScheme="red" onClick={() => handleUpdateStatus(selectedApp.id, "Rejected")}>
                Reject
              </Button>
              <Button variant="ghost" onClick={onClose}>Close</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EmployerDashboard;
