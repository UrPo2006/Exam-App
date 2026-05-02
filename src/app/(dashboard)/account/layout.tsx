



import { SidebarProvider } from "@/components/ui/sidebar";

import { Toaster } from "react-hot-toast";

import { HeaderProvider } from "@/components/ui/context/HeaderContext";

import AuthProvider from "@/app/auth-provider/providers";

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <HeaderProvider>
        <SidebarProvider>
          <div className="relative flex overflow-hidden">
            

     

            
              {children}
            <Toaster position="bottom-center" />
          </div>
        </SidebarProvider>
      </HeaderProvider>
    </AuthProvider>
  );
}
