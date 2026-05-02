import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = ["/"];
const adminPages = ["/admin"]; 
const authPages = ["/login", "/register"];

export default async function proxy(req: NextRequest) {

  const token = await getToken({ req });

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const pathname = req.nextUrl.pathname;

 
  if (protectedPages.includes(pathname)) {
    if (token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/login", baseUrl));
    }
  }

 
  if (adminPages.includes(pathname)) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", baseUrl));
    }

    if (token.role !== "ADMIN") {
    
      return NextResponse.redirect(new URL("/", baseUrl));
    }

    return NextResponse.next();
  }

  
  if (authPages.includes(pathname)) {
    if (!token) {
      return NextResponse.next();
    } else {
      
      if (token?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", baseUrl));
      }
 
      return NextResponse.redirect(new URL("/", baseUrl));
    }
  }

  return NextResponse.next();
}