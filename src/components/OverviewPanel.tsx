import { Box, Heading, Text, VStack } from "@chakra-ui/react";

const OverviewPanel = () => {
  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md" mb={6}>
      <Heading size="md" mb={4}>Overview</Heading>
      <VStack align="stretch" spacing={2}>
        <Text>Reputation Score: 85</Text>
        <Text>Latest Job Matches: 3</Text>
        <Text>Aid Applications: 1 pending</Text>
        <Text>Upcoming Medical Appointments: 2</Text>
      </VStack>
    </Box>
  );
};

export default OverviewPanel;