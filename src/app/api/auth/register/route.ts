import { SignUpRequest, SignUpResponse } from "@/interfaces/SignUpRequest";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  try {
    const body: SignUpRequest = await req.json();

    const res = await fetch(
      "https://exam-app.elevate-bootcamp.cloud/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        
      }
    );
   
    const data = await res.json();

 console.log(data)
    // لو في error من الـ API الخارجي
    if (!res.ok) {
  console.log("ERROR FROM API:", data); // 🔥 مهم
  return NextResponse.json(
    { message: data.message || "Register failed" ,errors: data.errors},
    { status: res.status }
  );
}

  
    return NextResponse.json<SignUpResponse>(data, { status: 201 });
  } catch (error) {
   if(error instanceof Error){
     return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
   }
    
  }
}
