// account-sidebar.tsx
"use client";

import LogoutButton from "@/components/ui/LogoutButton/LogoutButton";
import { User, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-60 flex flex-col justify-between py-2 h-full">
      <div className="flex flex-col gap-1">

        <Link href="/account">
          <span className={`flex items-center gap-3 px-4 py-3 text-sm font-mono transition-colors ${
            pathname === "/account"
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "text-gray-500 hover:bg-gray-50"
          }`}>
            <User className="w-4 h-4" />
            Profile
          </span>
        </Link>

        <Link href="/account/account-password"> {/* ✅ */}
          <span className={`flex items-center gap-3 px-4 py-3 text-sm font-mono transition-colors ${
            pathname === "/account/account-password" // ✅ نفس الـ href
              ? "bg-blue-50 text-blue-600 border border-blue-200"
              : "text-gray-500 hover:bg-gray-50"
          }`}>
            <Lock className="w-4 h-4" />
            Change Password
          </span>
        </Link>

      </div>

      <div className="flex   px-4 py-3 text-sm cursor-pointer font-mono  text-red-400 bg-red-50 transition-colors">
        <span className= " flex gap-3 mx-auto ">

             <LogOut className="w-4 h-4 text-red-600 rotate-180 font-light" />
       <LogoutButton/>

        </span>
     

      </div>
    </div>
  );
}