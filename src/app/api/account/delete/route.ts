
import { getDecodedToken } from "@/app/api/helpers/auth";

export async function DELETE() {
  const decoded = await getDecodedToken();
  const userToken = decoded?.token;

  const res = await fetch(
    "https://exam-app.elevate-bootcamp.cloud/api/users/account",
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  const data = await res.json();
  return Response.json(data);
}