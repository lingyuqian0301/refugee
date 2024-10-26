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

export default function SignupPage() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBgColor = useColorModeValue("white", "gray.800");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async () => {
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error);
      } else {
        router.push("/authencation/login"); // Redirect on success
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
          Sign Up
        </Heading>
        <VStack spacing={4}>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="filled"
            bg={useColorModeValue("gray.100", "gray.700")}
            _focus={{ borderColor: "blue.500" }}
          />
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
          <Input
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="filled"
            bg={useColorModeValue("gray.100", "gray.700")}
            _focus={{ borderColor: "blue.500" }}
          />
          {error && <Text color="red.500">{error}</Text>}
          <Button
            colorScheme="blue"
            w="100%"
            onClick={handleSignup}
            isLoading={loading}
          >
            Sign Up
          </Button>
        </VStack>
        <Text mt={4} textAlign="center">
          Already have an account?{" "}
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => router.push("/authencation/login")}
          >
            Log In
          </Button>
        </Text>
      </Box>
    </Box>
  );
}
