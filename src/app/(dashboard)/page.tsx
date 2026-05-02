"use client";
import DiplomasPage from "@/app/(dashboard)/diplomas/page";
import { useSession } from "next-auth/react";
import DiplomasTable from "../(admin)/admin-diplomas/page";

export default function Home() {
  const {data : session} = useSession()
    const role = session?.role
       if (role === "ADMIN") {
         return (
    <>

     <DiplomasTable/>
     

    </>
  )
        }
  return (
    <>
      <DiplomasPage />
    </>
  );
}
