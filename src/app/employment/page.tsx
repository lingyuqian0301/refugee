"use client";

import React from 'react';
import { Box, Flex, Heading, Tabs, TabList, TabPanels, Tab, TabPanel, Text, useColorModeValue } from "@chakra-ui/react";
import { FaBriefcase, FaClipboardList, FaCertificate, FaRobot } from "react-icons/fa";
import JobListings from './JobListings';
import ApplicationManagement from './ApplicationManagement';
import SkillVerification from './SkillVerification';
import AIRecommendations from './AIRecommendations';

export default function EmploymentPlatform() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Box
        bgImage="url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="cover"
        h="300px"
        position="relative"
        mb={8}
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
          <Heading size="2xl" mb={4}>Employment Platform</Heading>
          <Text fontSize="xl">Find your next opportunity and manage your career</Text>
        </Box>
      </Box>

      <Flex direction="column" maxW="1200px" mx="auto" px={[6, 8, 10]}>
        <Tabs variant="soft-rounded" colorScheme="blue" isLazy>
          <TabList mb={8} overflowX="auto" py={2}>
            <Tab mx={2} _selected={{ color: "white", bg: "blue.500" }}>
              <Flex align="center">
                <FaBriefcase style={{ marginRight: '8px' }} />
                Job Listings
              </Flex>
            </Tab>
            <Tab mx={2} _selected={{ color: "white", bg: "green.500" }}>
              <Flex align="center">
                <FaClipboardList style={{ marginRight: '8px' }} />
                My Applications
              </Flex>
            </Tab>
            <Tab mx={2} _selected={{ color: "white", bg: "purple.500" }}>
              <Flex align="center">
                <FaCertificate style={{ marginRight: '8px' }} />
                Skill Verification
              </Flex>
            </Tab>
            <Tab mx={2} _selected={{ color: "white", bg: "orange.500" }}>
              <Flex align="center">
                <FaRobot style={{ marginRight: '8px' }} />
                AI Recommendations
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
      </Flex>
    </Box>
  );
}
