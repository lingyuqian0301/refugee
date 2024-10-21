import React, { useState } from 'react';
import { Box, VStack, Text, Icon, Link, Flex, useColorModeValue, Tooltip } from "@chakra-ui/react";
import { FiHome, FiBriefcase, FiUsers, FiMessageSquare, FiFileText } from "react-icons/fi";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const EmployerSidebar: React.FC = () => {
  const [activeLink, setActiveLink] = useState('/employer/dashboard');
  const bgColor = useColorModeValue("blue.50", "blue.900");
  const hoverBgColor = useColorModeValue("blue.100", "blue.800");
  const activeBgColor = useColorModeValue("blue.200", "blue.700");
  const textColor = useColorModeValue("gray.800", "white");

  const handleLinkClick = (path: string) => {
    setActiveLink(path);
  };

  const NavLink = ({ href, icon, children }) => (
    <Tooltip label={children} placement="right" hasArrow>
      <Link
        href={href}
        w="full"
        onClick={() => handleLinkClick(href)}
        _hover={{ textDecoration: 'none', bg: hoverBgColor }}
        bg={activeLink === href ? activeBgColor : 'transparent'}
        borderRadius="md"
        p={2}
        transition="all 0.3s"
        animation={activeLink === href ? `${pulse} 2s infinite` : 'none'}
      >
        <Flex align="center">
          <Icon as={icon} boxSize={6} mr={3} />
          <Text fontSize="md" fontWeight="medium">{children}</Text>
        </Flex>
      </Link>
    </Tooltip>
  );

  return (
    <Box as="nav" bg={bgColor} w="64" p={4} boxShadow="lg" borderRadius="xl" m={2}>
      <VStack spacing={6} align="stretch">
        <NavLink href="/employer/dashboard" icon={FiHome}>Dashboard</NavLink>
        <NavLink href="/employer/job-postings" icon={FiBriefcase}>Job Postings</NavLink>
        <NavLink href="/employer/applications" icon={FiUsers}>Applications</NavLink>
        <NavLink href="/employer/messages" icon={FiMessageSquare}>Messages</NavLink>
        <NavLink href="/employer/reports" icon={FiFileText}>Reports</NavLink>
      </VStack>
    </Box>
  );
};

export default EmployerSidebar;
