import { NextRequest, NextResponse } from "next/server";
import { getDecodedToken } from "@/app/api/helpers/auth";
import { imageSchema } from "@/schemes/image.schemas";
import { ErrorResponse } from "@/types/api";

export async function POST(req: NextRequest) {
  try {
  const decoded = await getDecodedToken();
   
    const userToken = decoded?.token;
  
    const formData = await req.formData();
    const image = imageSchema.safeParse({
      image: formData.get("image"),
    });
     console.log("Image data:", image);
    if (!image.success) {
          return NextResponse.json({ 
        code:400,
        message: image.error?.message,
        status: false,
       }satisfies ErrorResponse
       , { status: 401 });
    }

    const res = await fetch("https://exam-app.elevate-bootcamp.cloud/api/upload", {
      method: "POST",
      headers: {
      "Authorization": `Bearer ${userToken}`,
      },
      body: formData,
    });

    const url = await res.json();

    return NextResponse.json(url);

  } catch (error) {
    console.error("Critical Error during upload:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}