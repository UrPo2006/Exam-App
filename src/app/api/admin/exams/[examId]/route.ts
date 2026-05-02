import { NextResponse } from "next/server";
import { getDecodedToken } from "@/app/api/helpers/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string }> } 
) {
  try {
    const { examId } = await params; 
    console.log("Fetching exam with ID:", examId);
    
    const decoded = await getDecodedToken();
    const token = decoded?.token;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`https://exam-app.elevate-bootcamp.cloud/api/exams/${examId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch exam from external API" }, 
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Exam API Route Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}