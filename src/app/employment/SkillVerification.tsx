import React, { useState, useEffect } from 'react';
import { VStack, Box, Heading, Text, Button, Input, useToast } from "@chakra-ui/react";
import { ethers } from 'ethers';
import { getEthereumContract } from '../../utils/ethereum';

interface Skill {
  name: string;
  verifier: string;
  timestamp: number;
  isVerified: boolean;
  user?: string;
}

const SkillVerification: React.FC = () => {
  const [connectedAddress, setConnectedAddress] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [skillName, setSkillName] = useState('');
  const [verifiedSkills, setVerifiedSkills] = useState<Skill[]>([]);
  const [myVerifiedSkills, setMyVerifiedSkills] = useState<Skill[]>([]);
  const [verifiedByMeSkills, setVerifiedByMeSkills] = useState<Skill[]>([]);
  const toast = useToast();

  const connectWallet = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setConnectedAddress(address);
      console.log("Connected address:", address);
      toast({
        title: "Wallet Connected",
        description: `Connected with address: ${address}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const verifySkill = async () => {
    if (!connectedAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const contract = await getEthereumContract('skillVerification');
      const tx = await contract.verifySkill(targetAddress, skillName, {
        value: ethers.parseEther("0.001"),
        gasLimit: 200000
      });
      await tx.wait();
      console.log("Skill verified:", skillName, "for", targetAddress);
      toast({
        title: "Skill Verified",
        description: `Successfully verified ${skillName} for ${targetAddress}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchVerifiedSkills();
      fetchSkillsVerifiedByMe();
    } catch (error) {
      console.error("Error verifying skill:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred while verifying the skill",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchVerifiedSkills = async () => {
    if (!targetAddress) return;
    try {
      const contract = await getEthereumContract('skillVerification');
      const skills = await contract.getVerifiedSkills(targetAddress);
      console.log("Fetched verified skills for", targetAddress, ":", skills);
      const detailedSkills = await Promise.all(skills.map(async (skillName: string) => {
        const skillDetails = await contract.userSkills(targetAddress, skillName);
        return {
          name: skillName,
          verifier: skillDetails.verifier,
          timestamp: Number(skillDetails.timestamp),
          isVerified: skillDetails.isVerified
        };
      }));
      setVerifiedSkills(detailedSkills);
    } catch (error) {
      console.error("Error fetching verified skills:", error);
    }
  };

  const fetchSkillsVerifiedByMe = async () => {
    if (!connectedAddress) return;
    try {
      const contract = await getEthereumContract('skillVerification');
      const filter = contract.filters.SkillVerified(null, null, connectedAddress);
      const events = await contract.queryFilter(filter);
      console.log("Events for skills verified by me:", events);
      const verifiedSkills = await Promise.all(events.map(async (event) => {
        const [user, skillName, verifier] = event.args;
        return {
          name: skillName,
          verifier: verifier,
          timestamp: Number(event.blockNumber),
          isVerified: true,
          user: user
        };
      }));
      console.log("Skills verified by me:", verifiedSkills);
      setVerifiedByMeSkills(verifiedSkills);
    } catch (error) {
      console.error("Error fetching skills verified by me:", error);
    }
  };

  const fetchMyVerifiedSkills = async () => {
    if (!connectedAddress) return;
    try {
      const contract = await getEthereumContract('skillVerification');
      const filter = contract.filters.SkillVerified(connectedAddress);
      const events = await contract.queryFilter(filter);
      console.log("Events for my verified skills:", events);
      const verifiedSkills = await Promise.all(events.map(async (event) => {
        const [user, skillName, verifier] = event.args;
        return {
          name: skillName,
          verifier: verifier,
          timestamp: Number(event.blockNumber),
          isVerified: true
        };
      }));
      console.log("My verified skills:", verifiedSkills);
      setMyVerifiedSkills(verifiedSkills);
    } catch (error) {
      console.error("Error fetching my verified skills:", error);
    }
  };

  useEffect(() => {
    if (connectedAddress) {
      fetchSkillsVerifiedByMe();
      fetchMyVerifiedSkills();
    }
  }, [connectedAddress]);

  useEffect(() => {
    if (targetAddress) {
      fetchVerifiedSkills();
    }
  }, [targetAddress]);

  return (
    <VStack spacing={4}>
      <Heading>Skill Verification</Heading>
      {!connectedAddress ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <Text>Connected: {connectedAddress}</Text>
      )}
      <Input
        placeholder="Target Address (to verify skills for)"
        value={targetAddress}
        onChange={(e) => setTargetAddress(e.target.value)}
      />
      <Input
        placeholder="Skill Name"
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
      />
      <Button onClick={verifySkill} isDisabled={!connectedAddress}>Verify Skill</Button>
      
      {connectedAddress && (
        <Box>
          <Heading size="md">My Verified Skills</Heading>
          {myVerifiedSkills.length === 0 ? (
            <Text>No verified skills found</Text>
          ) : (
            myVerifiedSkills.map((skill, index) => (
              <Box key={index} borderWidth={1} borderRadius="lg" p={4} mt={2}>
                <Text><strong>Skill:</strong> {skill.name}</Text>
                <Text><strong>Verified by:</strong> {skill.verifier}</Text>
                <Text><strong>Verified on:</strong> {new Date(skill.timestamp * 1000).toLocaleString()}</Text>
              </Box>
            ))
          )}
        </Box>
      )}
      
      {/* {connectedAddress && (
        <Box>
          <Heading size="md">Skills I've Verified</Heading>
          {verifiedByMeSkills.length === 0 ? (
            <Text>No skills verified by you</Text>
          ) : (
            verifiedByMeSkills.map((skill, index) => (
              <Box key={index} borderWidth={1} borderRadius="lg" p={4} mt={2}>
                <Text><strong>Skill:</strong> {skill.name}</Text>
                <Text><strong>Verified for:</strong> {skill.user}</Text>
                <Text><strong>Verified on:</strong> {new Date(skill.timestamp * 1000).toLocaleString()}</Text>
              </Box>
            ))
          )}
        </Box>
      )} */}
      
      {targetAddress && (
        <Box>
          <Heading size="md">Verified Skills for {targetAddress}</Heading>
          {verifiedSkills.length === 0 ? (
            <Text>No verified skills found for this address</Text>
          ) : (
            verifiedSkills.map((skill, index) => (
              <Box key={index} borderWidth={1} borderRadius="lg" p={4} mt={2}>
                <Text><strong>Skill:</strong> {skill.name}</Text>
                <Text><strong>Verifier:</strong> {skill.verifier}</Text>
                <Text><strong>Verified on:</strong> {new Date(skill.timestamp * 1000).toLocaleString()}</Text>
              </Box>
            ))
          )}
        </Box>
      )}
    </VStack>
  );
};

export default SkillVerification;
