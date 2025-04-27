import type { RequestHandler } from '@sveltejs/kit';
import OpenAI from 'openai';
import { json } from '@sveltejs/kit';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const POST: RequestHandler = async ({ request }) => {
  const { prompt } = await request.json();
  const res = await openai.chat.completions.create({
    model: "code-davinci-002",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500
  });
  return json({ code: res.choices[0].message.content });
};
