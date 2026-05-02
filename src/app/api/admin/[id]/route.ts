import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken } from "@/app/api/helpers/auth";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const decoded = await getDecodedToken();
    const userToken = decoded?.token;

    const res = await fetch(
      `https://exam-app.elevate-bootcamp.cloud/api/diplomas/${id}`,
      {
        method: "DELETE",
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