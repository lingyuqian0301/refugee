"use client";

import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
      } else {
        // Redirect based on user role
        if (result.user.role === 0) {
          router.push("/dashboard"); // Role 0 redirects to /dashboard
        } else {
          router.push("/other-role-page"); // Other roles can be redirected to another page
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={bgColor}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={cardBgColor}
        p={[6, 8]}
        borderRadius="lg"
        boxShadow="md"
        maxW="400px"
        w="100%"
      >
        <Heading mb={6} textAlign="center">
          Log In
        </Heading>
        <VStack spacing={4}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            bg={useColorModeValue("gray.100", "gray.700")}
            _focus={{ borderColor: "blue.500" }}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            bg={useColorModeValue("gray.100", "gray.700")}
            _focus={{ borderColor: "blue.500" }}
          />
          {error && <Text color="red.500">{error}</Text>}
          <Button
            colorScheme="blue"
            w="100%"
            onClick={handleLogin}
            isLoading={loading}
          >
            Log In
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          Don't have an account?{" "}
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => router.push("/authencation/signup")}
          >
            Sign Up
          </Button>
        </Text>
      </Box>
    </Box>
  );
}
