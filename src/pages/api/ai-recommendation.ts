import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const { userAddress, verifiedSkills } = await request.json();
    if (!userAddress || !verifiedSkills) {
      return NextResponse.json(
        { error: 'User address and verified skills are required' },
        { status: 400 }
      );
    }

    console.log('Received verified skills:', verifiedSkills);

    if (verifiedSkills.length === 0) {
      return NextResponse.json({
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

    return NextResponse.json({
      verifiedSkills: verifiedSkills,
      ...recommendations
    });
  } catch (error: any) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { error: `Failed to generate recommendations: ${error.message}` },
      { status: 500 }
    );
  }
}