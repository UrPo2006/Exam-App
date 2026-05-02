
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getDecodedToken() {
  try {
    const cookieStore = await cookies(); 
    

    const tokenCookie = 
      cookieStore.get("next-auth.session-token") || 
      cookieStore.get("__Secure-next-auth.session-token");

    if (!tokenCookie || !tokenCookie.value) {
      console.warn("No token cookie found in request");
      return null;
    }


    const decoded = await decode({
      token: tokenCookie.value,
      secret: process.env.NEXTAUTH_SECRET as string,
    });

    return decoded;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
}