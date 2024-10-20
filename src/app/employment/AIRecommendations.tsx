import React, { useState, useEffect } from 'react';
import { VStack, Box, Heading, Text, Button, Spinner } from "@chakra-ui/react";

const AIRecommendations: React.FC = () => {
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [trainingRecommendations, setTrainingRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/ai-recommendations');
        const data = await response.json();
        setJobRecommendations(data.jobRecommendations);
        setTrainingRecommendations(data.trainingRecommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <VStack spacing={6} align="stretch">
      <Box>
        <Heading size="md" mb={2}>Recommended Jobs</Heading>
        {jobRecommendations.map(job => (
          <Box key={job.id} p={2} borderWidth={1} borderRadius="md" mb={2}>
            <Text fontWeight="bold">{job.title}</Text>
            <Text>{job.company}</Text>
            <Button size="sm" mt={1} colorScheme="blue">View Job</Button>
          </Box>
        ))}
      </Box>
      
      <Box>
        <Heading size="md" mb={2}>Recommended Training Programs</Heading>
        {trainingRecommendations.map(program => (
          <Box key={program.id} p={2} borderWidth={1} borderRadius="md" mb={2}>
            <Text fontWeight="bold">{program.title}</Text>
            <Text>{program.provider}</Text>
            <Button size="sm" mt={1} colorScheme="green">Enroll</Button>
          </Box>
        ))}
      </Box>
    </VStack>
  );
};

export default AIRecommendations;
