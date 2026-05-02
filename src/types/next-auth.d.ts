import { UserResponse } from "@/interfaces";
import type { DefaultSession, DefaultUser } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

/* ---------------- next-auth ---------------- */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: UserResponse;
    token: string;      
    role: string;
  }

  interface User extends DefaultUser {
    user: UserResponse;
    token: string;
     role: string; 
  }
}

/* ---------------- next-auth/jwt ---------------- */
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: UserResponse;
    token: string;
     role: string;
  }
}
