
import "../../../src/app/globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AuthProvider from "../auth-provider/providers";
import { Toaster } from "react-hot-toast";
import DynamicHeader from "@/components/ui/header/header";

import { HeaderProvider } from "@/components/ui/context/HeaderContext";
import { ProfileProvider } from "@/components/ui/context/ProfileContext";
import ASideBar from "./components/a-side-bar/side-bar";
import Providers from "@/providers";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<Providers>


    <AuthProvider>
       <ProfileProvider>
        <HeaderProvider>
        <SidebarProvider>
          <div className="relative flex overflow-hidden">
            <Toaster position="top-center" reverseOrder={false} />

            <ASideBar />

            <div className="flex flex-col flex-1 overflow-y-auto">
              <header className=" w-296  h-12 sticky top-0 ml-31  ">
                <DynamicHeader />
              </header>

              <main className="flex-1  bg-gray-50  ml-26 ">
                <SidebarTrigger className="md:hidden" />
 {children}
              
              </main>
            </div>
          </div>
        </SidebarProvider>
      </HeaderProvider>
       </ProfileProvider>
      
    </AuthProvider>
    </Providers>
  );
}
