import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const experience = req.nextUrl.searchParams.get("experience")!;
  const domain = req.nextUrl.searchParams.get("domain")!;
  const skills = req.nextUrl.searchParams.get("skills")!;
  const resume = req.nextUrl.searchParams.get("resume")!;

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `I'd like you to assist me in crafting a technical mock interview flow for the position of ${domain}. 

  **Candidate Information:**
  
  * **Skills:** ${skills}
  * **Experience:** ${experience}
  * **Domain:** ${domain}
  * **Resume:** ${resume}
  
  **Desired Flow:**
  
  Please suggest a structured interview flow with approximate time allocations for each section, considering the candidate's skills and experience level. Take project from the user's resume.

  Avoid revealing the specific questions within them. Be very attentive of the amount of experience the candidate has, design the flow accordingly.

  DO NOT INCLUDE BEHAVIOURAL ROUNDS. ONLY TECHNICAL ROUNDS.
  
  DO NOT exceed the time limit of 1 hour including the coding round and conceptual round.

  Here are some sections you can include:
  * Technical Assessment (Conceptual, Scenario-based, Coding)
  * Project Discussion
  * Conclusion
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return NextResponse.json({ resp: text });
}
