import { Box, Heading, Text, VStack, Badge } from "@chakra-ui/react";

const Notifications = () => {
  const notifications = [
    { id: 1, message: "New message from Job Center", type: "info" },
    { id: 2, message: "Aid distribution update: Your application is under review", type: "warning" },
    { id: 3, message: "New job opportunity in your area", type: "success" },
    { id: 4, message: "System maintenance scheduled for next week", type: "info" },
  ];

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Notifications</Heading>
      <VStack align="stretch" spacing={3}>
        {notifications.map((notification) => (
          <Box key={notification.id} p={3} bg="gray.50" borderRadius="md">
            <Text>{notification.message}</Text>
            <Badge colorScheme={notification.type === "info" ? "blue" : notification.type === "warning" ? "yellow" : "green"}>
              {notification.type}
            </Badge>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default Notifications;