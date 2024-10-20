import OpenAI from 'openai';
import { ethers } from 'ethers';
import { SkillVerificationABI } from '../../contractABIs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const skillVerificationAddress = process.env.SKILL_VERIFICATION_ADDRESS;

async function getVerifiedSkills(userAddress) {
  try {
    if (!process.env.ETHEREUM_RPC_URL) {
      throw new Error('ETHEREUM_RPC_URL is not set in the environment variables');
    }
    if (!skillVerificationAddress) {
      throw new Error('SKILL_VERIFICATION_ADDRESS is not set in the environment variables');
    }

    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    
    console.log('Skill Verification Address:', skillVerificationAddress);
    console.log('Skill Verification ABI:', JSON.stringify(SkillVerificationABI).substring(0, 100) + '...');

    const contract = new ethers.Contract(skillVerificationAddress, SkillVerificationABI, provider);
    
    const skills = await contract.getVerifiedSkills(userAddress);
    console.log('Raw skills:', skills);

    const detailedSkills = await Promise.all(skills.map(async (skillName) => {
      const skillDetails = await contract.userSkills(userAddress, skillName);
      return {
        name: skillName,
        verifier: skillDetails.verifier,
        timestamp: Number(skillDetails.timestamp),
        isVerified: skillDetails.isVerified
      };
    }));
    return detailedSkills;
  } catch (error) {
    console.error('Error fetching verified skills:', error);
    throw new Error(`Failed to fetch verified skills: ${error.message}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userAddress, verifiedSkills } = req.body;
    if (!userAddress || !verifiedSkills) {
      return res.status(400).json({ error: 'User address and verified skills are required' });
    }

    console.log('Received verified skills:', verifiedSkills);

    if (verifiedSkills.length === 0) {
      return res.status(200).json({
        verifiedSkills: [],
        jobRecommendations: [],
        trainingRecommendations: []
      });
    }

    const skillNames = verifiedSkills.map(skill => skill.name);

    const prompt = `Based on the following verified skills: ${skillNames.join(', ')}, 
                    suggest job recommendations and training programs that best match these abilities.
                    Format the response as JSON with two arrays: 'jobRecommendations' and 'trainingRecommendations'.
                    Each job should have 'title' and 'description' fields.
                    Each training program should have 'title' and 'provider' fields.`;

    console.log('Sending prompt to OpenAI:', prompt);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant that provides job and training recommendations based on skills."},
        {"role": "user", "content": prompt}
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const recommendations = JSON.parse(completion.choices[0].message.content);
    console.log('Received recommendations:', recommendations);

    res.status(200).json({
      verifiedSkills: verifiedSkills,
      ...recommendations
    });
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    res.status(500).json({ error: `Failed to generate recommendations: ${error.message}` });
  }
}
