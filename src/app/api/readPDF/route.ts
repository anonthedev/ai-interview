import { NextRequest, NextResponse } from "next/server";
import PdfParse from "pdf-parse";

export async function POST(req: NextRequest, res: NextResponse) {
  const formData: FormData = await req.formData();
  const uploadedFile = formData.get("file");
  let parsedText = "";

  if (uploadedFile instanceof File) {
    const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

    parsedText = (await PdfParse(fileBuffer)).text
  } else {
    console.log("No files found.");
  }

  return NextResponse.json({ text: parsedText });
}
