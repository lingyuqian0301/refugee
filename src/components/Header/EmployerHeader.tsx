import React from 'react';
import { Box, Flex, Heading, IconButton, Avatar, Menu, MenuButton, MenuList, MenuItem, Text, useColorModeValue } from "@chakra-ui/react";
import { FiBell, FiSettings, FiLogOut, FiBriefcase, FiUsers } from "react-icons/fi";

const EmployerHeader: React.FC = () => {
  const bgGradient = useColorModeValue(
    "linear(to-r, blue.400, purple.500)",
    "linear(to-r, blue.600, purple.700)"
  );
  const textColor = useColorModeValue("white", "gray.100");

  return (
    <Box as="header" bgGradient={bgGradient} boxShadow="lg" p={4}>
      <Flex justify="space-between" align="center">
        <Flex align="center">
          <IconButton
            aria-label="Company Logo"
            icon={<FiBriefcase />}
            variant="ghost"
            color={textColor}
            fontSize="2xl"
            mr={3}
          />
          <Heading size="lg" color={textColor}>Employer Hub</Heading>
        </Flex>
        <Flex align="center">
          <IconButton
            aria-label="Job Applications"
            icon={<FiUsers />}
            variant="ghost"
            color={textColor}
            mr={2}
          />
          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
            variant="ghost"
            color={textColor}
            mr={2}
          />
          <Menu>
            <MenuButton
              as={Avatar}
              size="sm"
              src="https://bit.ly/broken-link"
              cursor="pointer"
              bg="white"
            />
            <MenuList>
              <MenuItem icon={<FiSettings />}>Settings</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      <Text color={textColor} mt={2} fontSize="sm">Connecting employers with talented individuals</Text>
    </Box>
  );
};

export default EmployerHeader;
