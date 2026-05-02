"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";


import {
  LogOut,
  UserRound,
  MoreVertical,
  GraduationCap,
  BookOpen,
  ClipboardList,
  LayoutGrid,
  BookOpenCheck,
  Logs,
} from "lucide-react";

import UserImage from "@/components/ui/user/user";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo/logo";

const navItems = [
  { hrefs: ["/admin","/admin-diploma","/admin-diplomas","/add-diploma"], label: "Diplomas", icon: GraduationCap },
  { hrefs: [ "/admin-exams","/add-exam","/add-qu"], label: "Exams", icon: BookOpenCheck },
  { hrefs: ["/admin/account"], label: "Account Settings", icon: UserRound },
  { hrefs: ["/admin-audit-logs"], label: "Audit Log", icon: Logs },
];

export default function ASideBar() {
 
  const pathname = usePathname();

  const isActive = (hrefs: string[]) =>
    hrefs.some((href) => pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
    
    <Sidebar>
      <SidebarContent className=" bg-gray-800  w-91 h-full  p-10  border-r-2">

        {/*Header*/}
        <SidebarHeader className="mb-10">
          <Logo />
        </SidebarHeader>

        {/*Nav Items*/}
        <SidebarContent className="flex-1">
          <SidebarGroup className="flex flex-col gap-1  w-72">
            {navItems.map(({ hrefs, label, icon: Icon }) => (
              <Link key={hrefs[0]} href={hrefs[0]}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 transition-colors duration-200 ${
                    isActive(hrefs)
                      ? "border-1 bg-white/10   text-white"
                      : "text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive(hrefs) ? "text-white" : "text-gray-400"}`} />
                  <SidebarGroupLabel
                    className={`text-lg  font-medium font-mono ${
                      isActive(hrefs) ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </SidebarGroupLabel>
                </span>
              </Link>
            ))}
          </SidebarGroup>
        </SidebarContent>

        {/*Footer*/}
        <SidebarFooter className="mt-auto pt-4">
          <DropdownMenu>
            <div className="flex items-center justify-between w-full px-2 py-2">
              <UserImage />
              <DropdownMenuTrigger asChild>
                <button className="ml-2">
                  <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
                </button>
              </DropdownMenuTrigger>
            </div>

            <DropdownMenuContent
              className="w-52 bg-white shadow-xl   p-1"
              side="top"
            >
              {/* Account */}
              <Link href="/account">
                <DropdownMenuGroup className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <UserRound className="w-4 h-4 text-gray-500" />
                  <DropdownMenuItem className="text-sm text-gray-600 cursor-pointer p-0 font-mono">
                    Account
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </Link>

              {/* Application */}
              <DropdownMenuGroup className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <LayoutGrid className="w-4 h-4 text-gray-500" />
                <DropdownMenuItem className="text-sm text-gray-600 cursor-pointer p-0 font-mono">
                  Application
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1" />

              {/* Logout */}
              <DropdownMenuGroup
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 cursor-pointer"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                <LogOut className="w-4 h-4 text-red-500 rotate-180" />
                <DropdownMenuItem className="text-sm text-red-500 cursor-pointer p-0 font-mono">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>

            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>

      </SidebarContent>
    </Sidebar>
    </>
  );
}