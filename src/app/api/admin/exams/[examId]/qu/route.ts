import { getDecodedToken } from "@/app/api/helpers/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const decoded = await getDecodedToken();
  const userToken = decoded?.token;

  // استخراج examId من الرابط (Query Params) مثل: /api/questions?examId=123
  const { searchParams } = new URL(request.url);
  const examId = searchParams.get("examId");
console.log("Fetching questions for examId:", examId);
  if (!userToken) {
    return NextResponse.json(
      { status: false, message: "No token found in session" },
      { status: 401 }
    );
  }

  if (!examId) {
    return NextResponse.json(
      { status: false, message: "Missing examId parameter" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://exam-app.elevate-bootcamp.cloud/api/questions?exam=${examId}`, 
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": userToken, // تأكد إذا كان الـ API يتطلب Authorization أو token مباشرة كما في التوثيق
        },
      }
    );

    const data = await res.json();
    
    // ملاحظة: الـ API عادة يرجع البيانات داخل payload.data
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}