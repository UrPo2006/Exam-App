// app/api/account/route.ts
import { getDecodedToken } from "../helpers/auth";

export async function GET() {
  const decoded = await getDecodedToken();
  const userToken = decoded?.token;

  const res = await fetch(
    "https://exam-app.elevate-bootcamp.cloud/api/users/profile",
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  const data = await res.json();
  return Response.json(data);
}

export async function PUT(request: Request) {
  const decoded = await getDecodedToken();
  const userToken = decoded?.token;
  const body = await request.json();

  // ─── تحويل الـ phone من +201XXXXXXXXX لـ 01XXXXXXXXX ───
  let phone = body.phone ?? "";
  if (phone.startsWith("+20")) {
    phone = "0" + phone.slice(3); // +201012345678 → 01012345678
  }

  const res = await fetch(
    "https://exam-app.elevate-bootcamp.cloud/api/users/profile",
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        firstName: body.firstname,
        lastName: body.lastname,
        phone,
        profilePhoto: body.photo, 
      }),
    }
  );

  const data = await res.json();
  return Response.json(data);
}