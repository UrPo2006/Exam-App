"use client";

import { useHeader } from "./context/HeaderContext";
import Header from "./header/header";

// import Header from "@/components/Header";
// import { useHeader } from "@/context/HeaderContext";

export function HeaderWrapper() {
  const {headerTitle } = useHeader();
  return <Header headerTitle={headerTitle} />;
}