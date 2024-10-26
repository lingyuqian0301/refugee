'use client';

import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState } from 'react';
import { createClient } from '../../../utils/supabase/client';

export default function LoginPage() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      // Handle successful login (e.g., redirect or show a success message)
      console.log(data.message);
    } else {
      setError(data.message);
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
          Login
        </Heading>
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="filled"
            bg={useColorModeValue('gray.100', 'gray.700')}
            _focus={{ borderColor: 'blue.500' }}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="filled"
            bg={useColorModeValue('gray.100', 'gray.700')}
            _focus={{ borderColor: 'blue.500' }}
          />
          <Button type="submit" colorScheme="blue" w="100%">
            Log In
          </Button>
          {error && <Text color="red.500">{error}</Text>}
        </VStack>
        <Text mt={4} textAlign="center">
          Don't have an account?{' '}
          <Button
            variant="link"
            colorScheme="blue"
            onClick={() => (window.location.href = '/authencation/signup')}
          >
            Sign up
          </Button>
        </Text>
      </Box>
    </Box>
  );
}
