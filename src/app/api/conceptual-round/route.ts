import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

interface chatHistory {
  role: string;
  parts: { text: string }[];
}

export async function GET(req: NextRequest, res: NextResponse) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const interviewFlow = req.nextUrl.searchParams.get("interviewFlow")!;
  const skills = req.nextUrl.searchParams.get("skills")!;
  const query = req.nextUrl.searchParams.get("query")!;

  // console.log(interviewFlow, skills)

  const chatHistory: Array<chatHistory> = [
    {
      role: "user",
      parts: [
        {
          text: `
  * **Interview Flow:** ${interviewFlow} 
  
  This is the conceptual round of this interview flow. You have to ask the candidate questions based on the Conceptual Round section of this interview flow.
  
  Here's a list of skills that the candidate has listed 
  * **Skills:** ${skills}.
  
  Prepare a list of questions that you'll be asking and don't exceed the time limit for the conceptual round. You can ask the candidate to clarify further in an answer if you're not satisfied.`,
        },
      ],
    },
    {
      role: "model",
      parts: [{ text: "Okay" }],
    },
  ];

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });

  const msg = query;

  try {
    const result = await chat.sendMessage(msg);
    if (!result.response) {
      console.error("No response received:", result);
      return NextResponse.json({ error: "No response received" });
    }
    const text = await result.response.text();
    chatHistory.push(
      { role: "user", parts: [{ text: msg }] },
      { role: "model", parts: [{ text: text }] }
    );

      chatHistory.forEach((el)=>{console.log(el.role, el.parts[0].text)})
    // console.log(text);
    return NextResponse.json({ question: text });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Error processing your request" });
  }
}
