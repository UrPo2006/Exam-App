"use client";

import { useState } from "react";
import { Shredder, TriangleAlert } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import toast from "react-hot-toast";
import useDeleteAllLog from "@/hooks/use-delete-all-log";


export default function DeleteAllAdmin() {
  const [open, setOpen] = useState(false);

  const deleteMutation = useDeleteAllLog();
const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const handleDelete = async () => {
     setErrorMessage(null);
    try {
      await deleteMutation.mutateAsync();

      toast.success("Logs deleted successfully");
      setOpen(false);
    } catch (err: any) {
      if (err.message === "FORBIDDEN") {
        console.log("You are not allowed to delete logs (SUPER_ADMIN only)");
         setErrorMessage("⛔ Only SUPER_ADMIN is allowed to delete logs");
        return;
      }

      console.log("❌ Delete failed:", err);
    
    }
  };

  return (
    <>
      {/* Button */}
  <div className="flex bg-red-500 hover:bg-red-600 text-white t h-9 px-4 gap-2 shadow-none  cursor-pointer py-3 text-sm font-mono">
    <Shredder className="w-4 h-4 mt-1" /> 
        <button
        type="button"
        onClick={() => setOpen(true)}
        className=""
      >
        Clear All Logs
        
      </button>
  </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="min-w-140 p-0 rounded-none overflow-hidden">
          
          <div className="bg-white px-10 pt-12 pb-10 flex flex-col items-center gap-10">

            <div className="w-25 h-25 rounded-full bg-red-100/70 flex items-center justify-center p-3">
              <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                <TriangleAlert className="text-red-400 w-11 h-11" />
              </div>
            </div>

            <div className="text-center flex flex-col gap-2.5">
              <p className="font-mono text-[1.05rem] font-bold text-red-600 leading-tight">
                Are you sure you want to delete all logs?
              </p>
              <p className="text-[13.5px] text-gray-500 font-mono tracking-tight leading-relaxed">
                This action is permanent and cannot be undone.
              </p>
            </div>
           {errorMessage && (
  <p className="text-sm text-red-500 font-mono mt-2">
    {errorMessage}
  </p>
)}

          </div>

          {/* Buttons */}
          <div className="bg-gray-50 px-10 py-6 border-t border-gray-100 flex gap-3 w-full justify-center">

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-10 py-3 text-sm font-mono flex-1 text-gray-800 bg-gray-200 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="px-10 py-3 text-sm font-mono flex-1 text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, delete"}
            </button>

          </div>

        </DialogContent>
      </Dialog>
    </>
  );
}