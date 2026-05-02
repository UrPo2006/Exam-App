"use client";

import { useEffect } from "react";
import { useHeader } from "./context/HeaderContext";



type HeaderUpdaterProps = {
  diplomaName?: string;
  examName?: string;
  title?: string;
};

export default function HeaderUpdater({
  diplomaName,
  examName,
  title,
}: HeaderUpdaterProps) {
  const { setHeaderTitle } = useHeader();

  useEffect(() => {
    setHeaderTitle({
      title,
      diplomaName,
      examName,
    });
  }, [title, diplomaName, examName]);

  return null;
}