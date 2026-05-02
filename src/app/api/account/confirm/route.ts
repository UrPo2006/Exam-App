import { NextResponse } from "next/server";
import { getDecodedToken } from "../../helpers/auth";
  
 
export async function POST(req: Request) {
   const decoded = await getDecodedToken();
   const userToken = decoded?.token;
  try {
    const { code } = await req.json();
    const res = await fetch("https://exam-app.elevate-bootcamp.cloud/api/users/email/confirm", {
      method: "POST",
      headers: {   "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,},
      body: JSON.stringify({code }),
    });
    console.log(res)
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
