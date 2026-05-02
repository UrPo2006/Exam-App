import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken } from "@/app/api/helpers/auth";

export async function GET(req: NextRequest) {
  try {
    const decoded = await getDecodedToken();
    const userToken = decoded?.token;

    const { searchParams } = new URL(req.url);
    
    const params = new URLSearchParams();
    params.set("page", searchParams.get("page") || "1");
    params.set("limit", searchParams.get("limit") || "20");
    
    // "search" "search"
    if (searchParams.get("search")) params.set("search", searchParams.get("search")!);
    if (searchParams.get("sortBy")) params.set("sortBy", searchParams.get("sortBy")!);
    if (searchParams.get("sortOrder")) params.set("sortOrder", searchParams.get("sortOrder")!);
    if (searchParams.get("diplomaId")) params.set("diplomaId", searchParams.get("diplomaId")!);
    if (searchParams.get("immutable")) params.set("immutable", searchParams.get("immutable")!);

    const res = await fetch(
      `https://exam-app.elevate-bootcamp.cloud/api/exams?${params}`,
      {
        headers: {
          "Authorization": `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });

  } catch (error) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}