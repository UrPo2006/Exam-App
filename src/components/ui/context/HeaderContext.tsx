"use client";

type HeaderState = {
  title?: string;
  diplomaName?: string;
  examName?: string;
};
type HeaderContextType = {
  headerTitle: HeaderState;
  setHeaderTitle: (value: HeaderState) => void;
};
import { createContext, useContext, useState } from "react";

const HeaderContext = createContext<HeaderContextType | null>(null);
export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [headerTitle, setHeaderTitle] = useState<HeaderState>({
    title: "Diplomas",
  });

  return (
    <HeaderContext.Provider value={{ headerTitle, setHeaderTitle }}>
      {children}
    </HeaderContext.Provider>
  );
}
export const useHeader = () => {
  const context = useContext(HeaderContext);

  if (!context) {
    throw new Error("useHeader must be used within HeaderProvider");
  }

  return context;
};