import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { topic, context } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a creative newsletter naming assistant. Generate names that are catchy, memorable, and professional."
        },
        {
          role: "user",
          content: `Generate 5 creative and catchy newsletter names for a newsletter about ${topic}.${
            context ? ` Additional context: ${context}` : ''
          }`
        }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 200,
    });

    const generatedText = completion.choices[0].message.content;
    const names = generatedText?.split('\n').filter(name => name.trim() !== '') || [];

    return NextResponse.json({ names });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate names' },
      { status: 500 }
    );
  }
}