import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Heading, Text, Badge, Button, Table, Thead, Tbody, Tr, Th, Td,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  useColorModeValue, Flex
} from "@chakra-ui/react";
import EmployerHeader from '../../components/Header/EmployerHeader';
import EmployerSidebar from '../../components/EmployerSidebar';

export default function EmploymentPlatform() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <EmployerSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <EmployerHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto">
          <Box bg={bgColor}>
            <Box
              bgImage="url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"
              h="300px"
              position="relative"
            >
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(0,0,0,0.6)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                color="white"
              >
                <Heading size="2xl" mb={4}>Career Development Center</Heading>
                <Text fontSize="xl">Explore opportunities and manage your professional growth</Text>
              </Box>
            </Box>

            <Container maxW="container.xl" py={10}>
              <Tabs variant="enclosed" colorScheme="blue" isLazy>
                <TabList mb={8} overflowX="auto" py={2}>
                  <Tab _selected={{ color: "blue.600", bg: "blue.50", borderBottom: "2px solid" }} px={6}>
                    <Flex align="center">
                      <FaBriefcase style={{ marginRight: '8px' }} />
                      Job Opportunities
                    </Flex>
                  </Tab>
                  <Tab _selected={{ color: "green.600", bg: "green.50", borderBottom: "2px solid" }} px={6}>
                    <Flex align="center">
                      <FaClipboardList style={{ marginRight: '8px' }} />
                      Application Tracker
                    </Flex>
                  </Tab>
                  <Tab _selected={{ color: "purple.600", bg: "purple.50", borderBottom: "2px solid" }} px={6}>
                    <Flex align="center">
                      <FaCertificate style={{ marginRight: '8px' }} />
                      Skill Certification
                    </Flex>
                  </Tab>
                  <Tab _selected={{ color: "orange.600", bg: "orange.50", borderBottom: "2px solid" }} px={6}>
                    <Flex align="center">
                      <FaRobot style={{ marginRight: '8px' }} />
                      AI Career Advisor
                    </Flex>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Box bg={cardBgColor} borderRadius="lg" p={6} boxShadow="md">
                      <JobListings />
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box bg={cardBgColor} borderRadius="lg" p={6} boxShadow="md">
                      <ApplicationManagement />
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box bg={cardBgColor} borderRadius="lg" p={6} boxShadow="md">
                      <SkillVerification />
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Box bg={cardBgColor} borderRadius="lg" p={6} boxShadow="md">
                      <AIRecommendations />
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Container>
          </Box>
        </main>
      </div>
    </div>
  );
}
