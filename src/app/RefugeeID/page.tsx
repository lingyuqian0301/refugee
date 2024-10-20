import { Box, Flex, Heading} from "@chakra-ui/react";

import RefugeeRegistration from "../../components/RefugeeRegistration";
export default function Home() {
  return (
    <Box minH="100vh" bg="gray.100">
      <Flex direction="column" align="center" justify="center" h="full" p={8}>
        <Heading mb={6}>Refugee Registration System</Heading>
        <RefugeeRegistration />
      </Flex>
    </Box>
  );
}
