// context/ProfileContext.tsx
"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { IUser } from "@/interfaces";

interface ProfileContextType {
  user: IUser | null;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType>({
  user: null,
  refreshProfile: async () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);

  const refreshProfile = useCallback(async () => {
    const res = await fetch("/api/account");
    const data = await res.json();
    setUser(data.payload.user);
  }, []);

  return (
    <ProfileContext.Provider value={{ user, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);