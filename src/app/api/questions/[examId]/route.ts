import { getDecodedToken } from "@/app/api/helpers/auth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ examId: string }> }
) {
  const decoded = await getDecodedToken();
  const { examId } = await params; 

  const userToken = decoded?.token;

  if (!userToken) {
    return NextResponse.json(
      { status: false, message: "No token found" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `https://exam-app.elevate-bootcamp.cloud/api/questions/exam/${examId}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
      }
    );
    const data = await res.json();
    return NextResponse.json(data);
  } catch (errer) {
    return NextResponse.json({ status: false }, { status: 500 });
  }
}