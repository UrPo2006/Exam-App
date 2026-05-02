"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import useDeleteLog from "@/hooks/use-delete-log";

export default function DeleteAdmin({ logId }: { logId: string }) {
  const deleteMutation = useDeleteLog();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async () => {
    setErrorMessage(null);

    try {
      await deleteMutation.mutateAsync(logId);
    } catch (err: any) {
      if (err.message === "FORBIDDEN") {
        console.log("You are not allowed to delete logs (SUPER_ADMIN only)");
        setErrorMessage("⛔ Only SUPER_ADMIN can delete logs");
        return;
      }

      console.log("❌ Delete failed:", err);
  
    }
  };

  return (
    <div className="flex flex-col text-sm font-mono">
      <button
        onClick={handleDelete}
        className="flex items-center gap-2 pt-2"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

    </div>
  );
}