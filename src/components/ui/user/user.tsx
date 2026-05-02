"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useProfile } from "../context/ProfileContext";
import { useSession } from "next-auth/react";
// import { useProfile } from "@/context/ProfileContext";

export default function UserImage() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const { user, refreshProfile } = useProfile();
  const {data : session} = useSession()
  const role = session?.role
  // جيب البيانات أول مرة
  useEffect(() => {
    refreshProfile();
  }, []);

  // Image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
     
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = reader.result as string;
      setAvatar(img);
      localStorage.setItem("profileAvatar", img);
      toast.success("Image updated");
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const savedAvatar = localStorage.getItem("profileAvatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);
   

    //ADMIN

   if (role === "ADMIN") {
     return (
    <div className="flex items-center gap-4 w-full ">
      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden  hover:rounded-full transition-all duration-300">
        {avatar ? (
          <Image src={avatar} alt="profile" fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
            No Img
          </div>
        )}
        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      <div className="flex flex-col w-46">
       
        <span className="font-bold text-xl truncate text-white font-mono">
          {user?.firstName} {user?.lastName}
        </span>
        <span className="font-mono text-xs   text-muted-foreground truncate">
          {user?.email}
        </span>
      </div>
    </div>

  );
   }
  return (
    <div className="flex items-center gap-4 w-full">
      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden border-2 border-blue-600 hover:rounded-full transition-all duration-300">
        {avatar ? (
          <Image src={avatar} alt="profile" fill className="object-cover" unoptimized />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500">
            No Img
          </div>
        )}
        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
      </div>

      <div className="flex flex-col">
       
        <span className="font-bold text-xl truncate text-blue-600 font-">
          {user?.firstName} {user?.lastName}
        </span>
        <span className="text-xs text-muted-foreground truncate">
          {user?.email}
        </span>
      </div>
    </div>

  );
}