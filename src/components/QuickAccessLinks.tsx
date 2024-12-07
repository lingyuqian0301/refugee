import React from 'react';
import { Box, Text, Grid, GridItem, Button } from '@chakra-ui/react';

const quickLinks = [
  { title: 'Profile', info: 'View and update your profile', path: '/profile' },
  { title: 'Employment', info: 'Browse job opportunities', path: '/employment' },
  { title: 'Healthcare', info: 'Manage healthcare options', path: '/health/view' },
  { title: 'Aid', info: 'Track your aid applications', path: '/aid' },
  { title: 'Support', info: 'Get assistance and support', path: '/support' },
];

export default function QuickAccessLinks() {
  return (
    <Box p={5} bg="gray.100" rounded="md">
      <Text fontSize="2xl" fontWeight="bold" mb={5}>
        Quick Access Links
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {quickLinks.map((link, index) => (
          <GridItem key={index} w="100%" p={5} bg="white" rounded="lg" shadow="sm">
            <Text fontSize="lg" fontWeight="medium">{link.title}</Text>
            <Text mb={3}>{link.info}</Text>
            <Button colorScheme="blue" as="a" href={link.path}>
              Go to {link.title}
            </Button>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
