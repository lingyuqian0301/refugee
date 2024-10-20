import { Box, Flex, Heading, Text, VStack, HStack, Badge } from "@chakra-ui/react";
import OverviewPanel from "../../components/OverviewPanel";
import Notifications from "../../components/Notifications";
import QuickAccessLinks from "../../components/QuickAccessLinks";

export default function Dashboard() {
  return (
    <Box minH="100vh" bg="gray.100">
      <Flex direction="column" align="center" justify="center" h="full" p={8}>
        <Heading mb={6}>Dashboard </Heading>
        <Flex direction={["column", "row"]} w="full" gap={6}>
          <Box flex={1}>
            <OverviewPanel />
            <Notifications />
          </Box>
          <Box flex={1}>
            <QuickAccessLinks />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
