// src/app/api/diplomas/route.ts
import { getDecodedToken } from "@/app/api/helpers/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const decoded = await getDecodedToken();

  const userToken = decoded?.token;

  if (!userToken) {
    console.error("no token");
    return NextResponse.json(
      { status: false, message: "No token found in session" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      "https://exam-app.elevate-bootcamp.cloud/api/diplomas?page=1&limit=30",
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

  } catch (error) {
    return NextResponse.json(
      { status: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}




