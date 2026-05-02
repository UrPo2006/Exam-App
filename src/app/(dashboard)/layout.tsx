import SideBar from "@/components/ui/side-bar/side-bar";
import "../../../src/app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "../auth-provider/providers";
import { Toaster } from "react-hot-toast";
import DynamicHeader from "@/components/ui/header/header";

import { HeaderProvider } from "@/components/ui/context/HeaderContext";
import { ProfileProvider } from "@/components/ui/context/ProfileContext";
import AdminUser from "@/components/ui/sid-bar-admin-user/admin-user";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
       <ProfileProvider>
        <HeaderProvider>
        <SidebarProvider>
          <div className="relative flex overflow-hidden">
            <Toaster position="top-center" reverseOrder={false} />

            <AdminUser />

            <div className="flex flex-col flex-1 overflow-y-auto">
              <header className=" w-296  h-12 sticky top-0 ml-31  ">
                <DynamicHeader />
              </header>

              <main className="flex-1  bg-gray-50 p-6 ml-26 mt-24">
                <SidebarTrigger className="md:hidden" />

                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </HeaderProvider>
       </ProfileProvider>
      
    </AuthProvider>
  );
}
