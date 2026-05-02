
import { getDecodedToken } from "@/app/api/helpers/auth";

export async function POST(request: Request) {
  const decoded = await getDecodedToken();
  const userToken = decoded?.token;
  const body = await request.json();

  const res = await fetch(
    "https://exam-app.elevate-bootcamp.cloud/api/users/change-password",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        currentPassword: body.currentPassword,
        newPassword: body.newPassword,
        confirmPassword: body.confirmPassword,
      }),
    }
  );

  const data = await res.json();
  return Response.json(data);
}