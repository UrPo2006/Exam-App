"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import useToggleImmutableQU from "@/hooks/use-qu-immutable";



export default function QUImmutableButton({ QuestionId }: { QuestionId: string }) {
  const toggleImmutableQu = useToggleImmutableQU();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    setErrorMessage(null);

    try {
      await toggleImmutableQu.mutateAsync({
        QuestionId,
        immutable: true, 
      });
    } catch (err: any) {
      if (err.message === "FORBIDDEN") {
        console.log("You are not allowed (SUPER_ADMIN only)");
        setErrorMessage("⛔ Only SUPER_ADMIN can change this");
        return;
      }

      console.log("❌ Failed:", err);
      setErrorMessage("❌ Something went wrong");
    }
  };

  return (
    <div className="flex flex-col">
      <Button
        variant="outline"
        onClick={handleClick}
        disabled={toggleImmutableQu.isPending}
        className="gap-2 border-gray-300 bg-gray-200 text-gray-600"
      >
        <Ban className="w-4 h-4" />
        {toggleImmutableQu.isPending ? "Loading..." : "Immutable"}
      </Button>

    </div>
  );
}