import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken } from "@/app/api/helpers/auth";

export async function POST(req: NextRequest) {
  const decoded = await getDecodedToken();
  const userToken = decoded?.token;

  const body = await req.json();
  const { examId, answers, startedAt } = body;

  const response = await fetch(
    "https://exam-app.elevate-bootcamp.cloud/api/submissions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        examId,
        answers,  
        startedAt,
      }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}