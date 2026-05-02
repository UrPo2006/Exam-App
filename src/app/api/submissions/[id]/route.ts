// app/api/submissions/[id]/route.ts

import { getDecodedToken } from "../../helpers/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
      const decoded = await getDecodedToken();
      const userToken = decoded?.token;
  const { id } = await params;
   console.log("Fetching submission with ID:", id);
  const res = await fetch(
    `https://exam-app.elevate-bootcamp.cloud/api/submissions/${id}`,
    {
      headers: {
       "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
      },
    }
  );

  const data = await res.json();
  return Response.json(data);
}