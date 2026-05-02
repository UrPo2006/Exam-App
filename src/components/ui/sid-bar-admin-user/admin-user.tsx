'use client'
import React from 'react'
import { useSession} from "next-auth/react";
import ASideBar from '@/app/(admin)/components/a-side-bar/side-bar';
import SideBar from '../side-bar/side-bar';
export default function AdminUser() {
 const { data: session } = useSession();

  return (
    <>
      {session?.role ==="ADMIN" ? (
        <ASideBar/>
      ):(
          <SideBar/>
      )}
    
    
    
    </>
  )
}
