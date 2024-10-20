import React, { useState, useEffect } from 'react';
import { VStack, Box, Heading, Text, Button, Input, HStack, Badge, Progress, Select } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const JobListings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchedJob, setMatchedJob] = useState(null);

  // Updated mock job data with refugee-friendly options
  const jobs = [
    { id: 1, title: "Kitchen Helper", company: "Local Diner", location: "Downtown", matchPercentage: 95, description: "Assist in food preparation and kitchen cleaning.", requirements: "No experience necessary, on-the-job training provided", salary: "$15 - $18 per hour", language: "Basic English" },
    { id: 2, title: "Housekeeping Staff", company: "City Hotel", location: "Central", matchPercentage: 90, description: "Clean and maintain hotel rooms and common areas.", requirements: "No prior experience needed, training available", salary: "$14 - $16 per hour", language: "Basic English" },
    { id: 3, title: "Factory Worker", company: "Manufacturing Inc.", location: "Industrial Zone", matchPercentage: 88, description: "Assist in assembly line production and packaging.", requirements: "No experience required, safety training provided", salary: "$16 - $20 per hour", language: "Basic English or Spanish" },
    { id: 4, title: "Grocery Store Clerk", company: "FreshMart", location: "Various Locations", matchPercentage: 92, description: "Stock shelves, assist customers, and operate cash register.", requirements: "No prior experience needed, customer service skills a plus", salary: "$13 - $15 per hour", language: "English proficiency preferred" },
    { id: 5, title: "Landscaping Assistant", company: "Green Thumb Gardens", location: "Suburban Areas", matchPercentage: 85, description: "Help with planting, mowing, and general outdoor maintenance.", requirements: "No experience necessary, must be comfortable working outdoors", salary: "$15 - $17 per hour", language: "Basic English or Spanish" },
    // ... Add more refugee-friendly job listings as needed
  ];

  const filteredJobs = jobs.filter(job =>
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (languageFilter === '' || job.language.toLowerCase().includes(languageFilter.toLowerCase()))
  );

  const startAutoMatch = () => {
    setIsMatching(true);
    setTimeout(() => {
      setMatchedJob({
        id: jobs.length + 1,
        title: "Cooker for Old Folk Home",
        company: "Golden Years Care",
        location: "Sunny Valley",
        matchPercentage: 98,
        description: "Prepare nutritious and delicious meals for our lovely seniors.",
        requirements: "Basic cooking skills, patience, and a warm heart",
        salary: "$16 - $20 per hour",
        language: "Basic English"
      });
      setIsMatching(false);
    }, 3000); // 3 seconds of "matching" animation
  };

  return (
    <VStack spacing={6} align="stretch">
      <Box bg="blue.100" p={4} borderRadius="md">
        <Heading size="md" color="blue.700">Welcome to Job Opportunities</Heading>
        <Text>We'll help you find suitable jobs based on your skills and language proficiency!</Text>
      </Box>

      {/* New Auto-Matching Banner */}
      <Box bg="green.100" p={4} borderRadius="md">
        <Heading size="md" color="green.700">Auto-Matching Available</Heading>
        <Text>Our system automatically matches you with suitable jobs based on your profile!</Text>
        <Button mt={2} colorScheme="green" size="sm">Update Your Profile</Button>
      </Box>

      {/* Fun Auto-Matching Animation */}
      <Box 
        bg="orange.100" 
        p={4} 
        borderRadius="md" 
        textAlign="center"
        animation={isMatching ? `${pulse} 0.5s infinite` : 'none'}
      >
        <Heading size="md" color="orange.700">
          {isMatching ? "🍳 Cooking up a perfect match! 🍳" : "Ready to find your dream cooking job?"}
        </Heading>
        <Text mt={2}>
          {isMatching 
            ? "Stirring the pot of opportunities..." 
            : "Let's whip up a delicious career opportunity for you!"}
        </Text>
        {!isMatching && (
          <Button 
            mt={2} 
            colorScheme="orange" 
            onClick={startAutoMatch}
          >
            Find My Perfect Kitchen!
          </Button>
        )}
      </Box>

      {matchedJob && (
        <Box p={4} borderWidth={1} borderRadius="md" boxShadow="md" bg="green.50">
          <Heading size="md" color="green.700">🎉 We've found your perfect match! 🎉</Heading>
          <Text mt={2}><strong>{matchedJob.title}</strong> at {matchedJob.company}</Text>
          <Text>{matchedJob.description}</Text>
          <HStack mt={2}>
            <Badge colorScheme="green">Match: {matchedJob.matchPercentage}%</Badge>
            <Progress value={matchedJob.matchPercentage} size="sm" width="100px" colorScheme="green" />
          </HStack>
          <Button mt={2} size="sm" colorScheme="green">Apply Now</Button>
        </Box>
      )}

      <HStack>
        <Input 
          placeholder="Search jobs..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select 
          placeholder="Select language"
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="Basic English">Basic English</option>
        </Select>
        <Button colorScheme="blue">Search</Button>
      </HStack>
      
      {filteredJobs.map(job => (
        <Box key={job.id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm">
          <Heading size="md">{job.title}</Heading>
          <Text>{job.company} - {job.location}</Text>
          <Text mt={2}>{job.description}</Text>
          <Text mt={2}><strong>Requirements:</strong> {job.requirements}</Text>
          <Text><strong>Salary:</strong> {job.salary}</Text>
          <Text><strong>Language:</strong> {job.language}</Text>
          <HStack mt={2}>
            <Badge colorScheme="green">Match: {job.matchPercentage}%</Badge>
            <Progress value={job.matchPercentage} size="sm" width="100px" colorScheme="green" />
          </HStack>
          <Button mt={2} size="sm" colorScheme="blue">Apply</Button>
        </Box>
      ))}
    </VStack>
  );
};

export default JobListings;
