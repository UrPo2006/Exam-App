"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { LogOut, UserRound, MoreVertical, GraduationCap } from "lucide-react";

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
import Logo from "../Logo/logo";
import Link from "next/link";
import LogoutButton from "../LogoutButton/LogoutButton";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  {
    hrefs: ["/", "/diplomas", "/exam", "/results"],

    label: "Diplomas",
    icon: GraduationCap,
  },
  {
    hrefs: ["/account"],
    label: "Account Settings",
    icon: UserRound,
  },
];
  

export default function SideBar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
const isActive = (hrefs: string[]) =>
  hrefs.some((href) => pathname === href || pathname.startsWith(href + "/"));
 const router = useRouter();

const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/"); 
  };


  return (
    <>
  
      <div>
        <Sidebar>
          <SidebarContent className="w-90 h-full bg-blue-50 p-10  border-r-2">
            {/* HEADER */}
            <SidebarHeader>
              {/* logo */}
              <Logo />
            </SidebarHeader>

            {/* CONTENT */}
            <SidebarContent>
              <SidebarGroup className="flex flex-col gap-2 w-67 h-30">
                {navItems.map(({ hrefs, label, icon: Icon }) => {
                

                  return (
                    <Link key={hrefs[0]} href={hrefs[0]}>
                      <span
                        className={`flex gap-2 w-67 h-13 border transition-colors duration-200 ${
                          isActive(hrefs)
                            ? "border-blue-500 bg-blue-100"
                            : "border-transparent hover:bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 m-4 ${
                              isActive(hrefs) ? "text-blue-500" : "text-gray-500"
                          }`}
                        />
                        <SidebarGroupLabel
                          className={`text-lg font-semibold mt-3 ${
                               isActive(hrefs)? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {label}
                        </SidebarGroupLabel>
                      </span>
                    </Link>
                  );
                })}
              </SidebarGroup>
            </SidebarContent>

            {/* FOOTER */}
            <SidebarFooter>

              <DropdownMenu>
                <div className="flex items-center justify-between w-full p-2">
                  <UserImage />
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-start justify-items-end  w-5  ml-4   ">
                      <MoreVertical className="w-6 h-6 text-muted-foreground cursor-pointer " />
                    </button>
                  </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent className="bg-gray-100  w-66 ">
                  <DropdownMenuGroup className="flex w-66 h-12 p-4 gap-1.5">
                    <UserRound className="w-4 h-4 text-gray-500" />
                    <Link href="/account">
                      <DropdownMenuItem className="cursor-pointer">
                        Account
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />

  {session ? (
  <DropdownMenuGroup
    className="flex h-12 p-4 gap-1.5 cursor-pointer hover:bg-red-50"
    onClick={() => handleLogout()} 
  >
    <LogOut className="text-red-600 w-4 h-4 rotate-180" />
    <DropdownMenuItem className="cursor-pointer text-red-600">
      Logout
    </DropdownMenuItem>
  </DropdownMenuGroup>
) : (
  <Link href="/login">
    <DropdownMenuGroup className="flex h-12 p-4 gap-1.5">
      <UserRound className="w-4 h-4 text-gray-500" />
      <DropdownMenuItem className="cursor-pointer">
        Sign In
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </Link>
)}
                </DropdownMenuContent>
              </DropdownMenu>

            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
      </div>
    
      
    </>
  );
}
