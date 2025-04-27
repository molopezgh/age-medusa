// scripts/generate.js
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function run() {
  const res = await openai.chat.completions.create({
    model: "code-davinci-002",
    messages: [
      { role: "user", content: "Generate a SvelteKit + Medusa product details page." }
    ],
    max_tokens: 400
  });
  console.log(res.choices[0].message.content);
}

run();
