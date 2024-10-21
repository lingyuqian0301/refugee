'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Badge, Button, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useDisclosure, HStack, Divider, useColorModeValue, Flex, Progress
} from "@chakra-ui/react";
import EmployerHeader from '../../components/Header/EmployerHeader';
import EmployerSidebar from '../../components/EmployerSidebar';

export default function EmployerDashboard() {
  const [applications, setApplications] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedApp, setSelectedApp] = useState(null);
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const mockApplications = [
      { id: 1, name: "Khin", jobTitle: "Cooker", status: "Pending", appliedDate: "2024-10-23", skills: ["Cooking", "Patience", "Empathy"], skillMatch: 90, reputationScore: 85 },
      { id: 2, name: "Jane Smith", jobTitle: "Cooker", status: "Pending", appliedDate: "2024-10-22", skills: ["Cooking", "Meal Planning", "Nutrition Knowledge"], skillMatch: 85, reputationScore: 78 },
      { id: 3, name: "Bob Johnson", jobTitle: "Cooker", status: "Pending", appliedDate: "2024-10-21", skills: ["Cooking", "Teamwork", "Time Management"], skillMatch: 80, reputationScore: 20 },
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
    <Flex h="100vh">
      <EmployerSidebar />
      <Box flex={1} overflowY="auto">
        <EmployerHeader />
        <Box p={8}>
          <Heading mb={2}>Applications for Cooker Position</Heading>
          <Text mb={6}>Deens Maju Nasi Kandar Penang</Text>
          <Table variant="simple" bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Applied Date</Th>
                <Th>Status</Th>
                <Th>Skill Match</Th>
                <Th>Reputation Score</Th>
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
                    <Progress value={app.skillMatch} size="sm" colorScheme="blue" />
                    {app.skillMatch}%
                  </Td>
                  <Td>
                    <Progress value={app.reputationScore} size="sm" colorScheme={app.reputationScore < 50 ? "red" : "blue"} />
                    {app.reputationScore}
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
                  <Box>
                    <Text fontWeight="bold" mb={1}>Skill Match</Text>
                    <Progress value={selectedApp?.skillMatch} size="sm" colorScheme="blue" />
                    <Text mt={1}>{selectedApp?.skillMatch}%</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold" mb={1}>Reputation Score</Text>
                    <Progress value={selectedApp?.reputationScore} size="sm" colorScheme={selectedApp?.reputationScore < 50 ? "red" : "blue"} />
                    <Text mt={1}>{selectedApp?.reputationScore}</Text>
                  </Box>
                </VStack>
              </ModalBody>
              <Divider my={4} />
              <ModalFooter>
                <HStack spacing={4}>
                  <Button colorScheme="green" onClick={() => handleUpdateStatus(selectedApp?.id, "Approved")}>
                    Approve
                  </Button>
                  <Button colorScheme="red" onClick={() => handleUpdateStatus(selectedApp?.id, "Rejected")}>
                    Reject
                  </Button>
                  <Button variant="ghost" onClick={onClose}>Close</Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
    </Flex>
  );
}
