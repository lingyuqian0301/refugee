import React, { useState, useEffect } from 'react';
import { VStack, Box, Heading, Text, Button, Spinner, useToast } from "@chakra-ui/react";
import { ethers } from 'ethers';
import { getEthereumContract } from '../../utils/ethereum';

interface Skill {
  name: string;
  verifier: string;
  timestamp: number;
  isVerified: boolean;
}

interface JobRecommendation {
  title: string;
  description: string;
}

interface TrainingRecommendation {
  title: string;
  provider: string;
}

const AIRecommendations: React.FC = () => {
  const [verifiedSkills, setVerifiedSkills] = useState<Skill[]>([]);
  const [jobRecommendations, setJobRecommendations] = useState<JobRecommendation[]>([]);
  const [trainingRecommendations, setTrainingRecommendations] = useState<TrainingRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    console.log("useEffect triggered");
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    console.log("fetchRecommendations called");
    try {
      setIsLoading(true);
      setError(null);

      if (!window.ethereum) {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      console.log("User address:", userAddress);

      // Fetch verified skills directly from the contract
      const contract = await getEthereumContract('skillVerification');
      console.log("Contract:", contract);

      try {
        const skills = await contract.getVerifiedSkills(userAddress);
        console.log("Raw skills:", skills);

        if (skills.length === 0) {
          console.log("No skills found for the user");
          setVerifiedSkills([]);
          setJobRecommendations([]);
          setTrainingRecommendations([]);
          return;
        }

        const detailedSkills = await Promise.all(skills.map(async (skillName: string) => {
          try {
            const skillDetails = await contract.userSkills(userAddress, skillName);
            return {
              name: skillName,
              verifier: skillDetails.verifier,
              timestamp: Number(skillDetails.timestamp),
              isVerified: skillDetails.isVerified
            };
          } catch (error) {
            console.error(`Error fetching details for skill ${skillName}:`, error);
            return null;
          }
        }));

        const validDetailedSkills = detailedSkills.filter(skill => skill !== null);
        console.log("Detailed verified skills:", validDetailedSkills);
        setVerifiedSkills(validDetailedSkills);

        // Only proceed with AI recommendations if there are verified skills
        if (validDetailedSkills.length > 0) {
          console.log("Sending request to AI recommendations API");
          const response = await fetch('/api/ai-recommendations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userAddress, verifiedSkills: validDetailedSkills }),
          });

          console.log("Response status:", response.status);
          const responseText = await response.text();
          console.log("Response text:", responseText);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
          }

          const data = JSON.parse(responseText);
          console.log("API response data:", data);
          setJobRecommendations(data.jobRecommendations || []);
          setTrainingRecommendations(data.trainingRecommendations || []);
        } else {
          console.log("No verified skills found, skipping AI recommendations");
          setJobRecommendations([]);
          setTrainingRecommendations([]);
        }
      } catch (contractError) {
        console.error("Error interacting with the contract:", contractError);
        throw new Error(`Failed to fetch skills from the contract: ${contractError.message}`);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setError(error.message || 'An unknown error occurred');
      toast({
        title: "Error",
        description: `Failed to fetch recommendations: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Box>
        <Heading size="md" color="red.500">Error</Heading>
        <Text>{error}</Text>
        <Button onClick={() => window.location.reload()} mt={4}>Try Again</Button>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={2}>My Verified Skills</Heading>
        {verifiedSkills.length === 0 ? (
          <Text>No verified skills found.</Text>
        ) : (
          verifiedSkills.map((skill, index) => (
            <Box key={index} p={2} borderWidth={1} borderRadius="md" mb={2}>
              <Text fontWeight="bold">{skill.name}</Text>
              <Text>Verified by: {skill.verifier}</Text>
              <Text>Verified on: {new Date(skill.timestamp * 1000).toLocaleString()}</Text>
            </Box>
          ))
        )}
      </Box>

      <Box>
        <Heading size="md" mb={2}>Recommended Jobs</Heading>
        {jobRecommendations.length === 0 ? (
          <Text>No job recommendations found.</Text>
        ) : (
          jobRecommendations.map((job, index) => (
            <Box key={index} p={2} borderWidth={1} borderRadius="md" mb={2}>
              <Text fontWeight="bold">{job.title}</Text>
              <Text>{job.description}</Text>
            </Box>
          ))
        )}
      </Box>
      
      <Box>
        <Heading size="md" mb={2}>Recommended Training Programs</Heading>
        {trainingRecommendations.length === 0 ? (
          <Text>No training recommendations found.</Text>
        ) : (
          trainingRecommendations.map((program, index) => (
            <Box key={index} p={2} borderWidth={1} borderRadius="md" mb={2}>
              <Text fontWeight="bold">{program.title}</Text>
              <Text>Provider: {program.provider}</Text>
            </Box>
          ))
        )}
      </Box>
    </VStack>
  );
};

export default AIRecommendations;
