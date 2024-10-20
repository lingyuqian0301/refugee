import { Configuration, OpenAIApi } from 'openai';
import { ethers } from 'ethers';
import { SkillVerificationABI } from '../../contractABIs';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const skillVerificationAddress = process.env.SKILL_VERIFICATION_ADDRESS;

async function getVerifiedSkills(userAddress) {
  const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
  const contract = new ethers.Contract(skillVerificationAddress, SkillVerificationABI, provider);
  const skills = await contract.getVerifiedSkills(userAddress);
  return skills.map(skill => skill.name);
}

export default async function handler(req, res) {
  try {
    // Fetch user profile and verified skills
    const userProfile = await fetchUserProfile(req.user.id);
    const verifiedSkills = await getVerifiedSkills(req.user.ethereumAddress);

    // Combine user profile with verified skills
    const enhancedProfile = {
      ...userProfile,
      verifiedSkills
    };

    // Use OpenAI API to generate recommendations
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Based on this user profile: ${JSON.stringify(enhancedProfile)}, 
               with a focus on their verified skills: ${verifiedSkills.join(', ')}, 
               suggest job recommendations and training programs that best match their verified abilities.`,
      max_tokens: 200,
    });

    // Parse the AI response and format it into job and training recommendations
    const recommendations = parseAIResponse(completion.data.choices[0].text);

    res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
}
