import { Skill } from '../types';

interface JobRecommendation {
  title: string;
  description: string;
}

interface AIRecommendationsResponse {
  jobRecommendations: JobRecommendation[];
}

export async function fetchAIRecommendations(userAddress: string, verifiedSkills: Skill[]): Promise<AIRecommendationsResponse> {
  const response = await fetch('/api/ai-recommendations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userAddress, verifiedSkills }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}