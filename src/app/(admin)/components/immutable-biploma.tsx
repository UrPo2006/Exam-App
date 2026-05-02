"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Ban } from "lucide-react";
import useToggleImmutable from "@/hooks/use-diploma-immutable";


export default function ImmutableButton({ diplomaId }: { diplomaId: string }) {
  const toggleImmutable = useToggleImmutable();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleClick = async () => {
    setErrorMessage(null);

    try {
      await toggleImmutable.mutateAsync({
        diplomaId,
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
        disabled={toggleImmutable.isPending}
        className="gap-2 border-gray-300 bg-gray-200 text-gray-600"
      >
        <Ban className="w-4 h-4" />
        {toggleImmutable.isPending ? "Loading..." : "Immutable"}
      </Button>

    </div>
  );
}