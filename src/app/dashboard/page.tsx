'use client';

import { Box, Flex, Heading, VStack, HStack, Icon, useColorModeValue, Text, Button, Badge, CloseButton } from "@chakra-ui/react";
import { FiActivity, FiBell, FiStar, FiUser, FiBriefcase, FiHelpCircle } from "react-icons/fi";
import OverviewPanel from "../../components/OverviewPanel";
import Notifications from "../../components/Notifications";
import QuickAccessLinks from "../../components/QuickAccessLinks";

export default function Dashboard() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");

  return (
    <Box minH="100vh" bg={bgColor}>
      <Flex direction="column" maxW="1200px" mx="auto" p={[6, 8, 10]}>
        <HStack mb={6} justify="space-between">
          <Heading size="lg">Dashboard</Heading>
          <HStack spacing={4}>
            <Icon as={FiBell} w={5} h={5} color="gray.500" cursor="pointer" />
            <Icon as={FiStar} w={5} h={5} color="gray.500" cursor="pointer" />
          </HStack>
        </HStack>

        <Flex direction={["column", null, "row"]} gap={8}>
          <VStack flex={2} spacing={8} align="stretch">
            <Box bg={cardBgColor} borderRadius="lg" p={8} boxShadow="md">
              <HStack mb={6}>
                <Icon as={FiActivity} w={6} h={6} color="blue.500" />
                <Heading size="md">Overview</Heading>
              </HStack>
              <OverviewPanel />
            </Box>
            <Box bg={cardBgColor} borderRadius="lg" p={8} boxShadow="md">
              <Heading size="md" mb={6}>Recent Notifications</Heading>
              <VStack spacing={4} align="stretch">
                {/* Example notification item */}
                <HStack justify="space-between">
                  <HStack spacing={3}>
                    <Badge colorScheme="blue" py={1} px={2}>INFO</Badge>
                    <Text>New job message received</Text>
                  </HStack>
                  <CloseButton size="sm" />
                </HStack>
                {/* More notifications... */}
              </VStack>
            </Box>
          </VStack>

          <Box flex={1}>
            <Box bg={cardBgColor} borderRadius="lg" p={8} boxShadow="md">
              <Heading size="md" mb={6}>Quick Access</Heading>
              <VStack spacing={4} align="stretch">
                <Button leftIcon={<FiUser />} colorScheme="blue" justifyContent="flex-start">Profile</Button>
                <Button leftIcon={<FiBriefcase />} colorScheme="green" justifyContent="flex-start">Employment</Button>
                <Button leftIcon={<FiHelpCircle />} colorScheme="purple" justifyContent="flex-start">Aid Application</Button>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
