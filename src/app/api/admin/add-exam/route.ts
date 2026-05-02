import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken } from "@/app/api/helpers/auth";
export async function POST(req: NextRequest) {
    const decoded = await getDecodedToken();
  
    const userToken = decoded?.token;
  
  try {
    
   const body = await req.json();

    const res = await fetch(
      "https://exam-app.elevate-bootcamp.cloud/api/exams",
      {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
           "Authorization": `Bearer ${userToken}`, 
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}