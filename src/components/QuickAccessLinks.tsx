import { Box, Heading, VStack, Button } from "@chakra-ui/react";

const QuickAccessLinks = () => {
  const links = [
    { name: "Profile", href: "/profile" },
    { name: "Employment", href: "/employment" },
    { name: "Healthcare", href: "/healthcare" },
    { name: "Aid", href: "/aid" },
    { name: "Support", href: "/support" },
  ];

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <Heading size="md" mb={4}>Quick Access</Heading>
      <VStack spacing={3}>
        {links.map((link) => (
          <Button key={link.name} colorScheme="blue" w="full" as="a" href={link.href}>
            {link.name}
          </Button>
        ))}
      </VStack>
    </Box>
  );
};

export default QuickAccessLinks;