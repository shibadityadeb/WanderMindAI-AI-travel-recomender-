import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const PROMPT = `You are an AI Trip Planner Agent. Your goal is to help the user plan a trip by asking one relevant trip-related question at a time.
Only ask questions about the following details in order, and wait for the user’s answer before asking the next:

Starting location (source)
Destination city or country
Group size (Solo, Couple, Family, Friends)
Budget (Low, Medium, High)
Trip duration (number of days)
Travel interests (e.g., adventure, sightseeing, cultural, food, nightlife, relaxation)
Special requirements or preferences (if any)

Do not ask multiple questions at once, and never ask irrelevant questions.
If any answer is missing or unclear, politely ask the user to clarify before proceeding.

Always maintain a conversational, interactive style while asking questions.

Along with response also send which UI component to display for generative UI (for example budget/groupSize/TripDuration/Final), where Final means AI generating complete final output.

Once all required information is collected, generate and return a strict JSON response only (no explanations or extra text) with the following JSON schema:

{
  resp: 'Text Resp',
  ui: 'budget/groupSize/TripDuration/Final'
}`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // 🛡 Ensure all messages are valid
  const safeMessages = (messages || []).filter(
    (m: any) => m && typeof m.content === "string" && m.content.trim() !== ""
  );

  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4.1-mini",
      messages: [
        { role: "system", content: PROMPT },
        ...safeMessages,
      ],
      max_tokens: 800,
      // ⚠️ Temporarily remove response_format if it still throws errors
      // response_format: { type: "json_object" },
    });

    const message = completion.choices[0].message;

    //Try parsing JSON, fallback if invalid
    let parsed;
    try {
      parsed = JSON.parse(message.content ?? "{}");
    } catch {
      parsed = { resp: message.content ?? "", ui: "Final" };
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json(error);
  }
}
