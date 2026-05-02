"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react"; 
export default function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();



const handleDelete = async () => {
  setLoading(true);
  try {
    const res = await fetch("/api/account/delete", {
      method: "DELETE",
    });
    const data = await res.json();
    console.log(data);

    if (data.status) {
      toast.success(data.message || "Your account has been deleted.");
      
     
      await signOut({ redirect: false });
      
      setTimeout(() => {
        router.push("/register");
      }, 1500);
    } else {
      toast.error(data.message || "Something went wrong");
    }
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};
  return (
    <>
      {/*Button*/}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex-1 cursor-pointer py-3 text-sm font-mono text-red-400 border border-red-100 bg-red-50 hover:bg-red-100 transition-colors"
      >
        Delete My Account
      </button>

      {/*Dialog*/}
     <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent className=" min-w-140 p-0 rounded-none overflow-hidden ">
   
    <div className="bg-white px-10 pt-12 pb-10 flex flex-col items-center gap-10">
      
    
      <div className="w-25 h-25 rounded-full bg-red-100/70 flex items-center justify-center p-3">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
          <TriangleAlert className="text-red-400 w-11 h-11" />
        </div>
      </div>

      
      <div className="text-center flex flex-col gap-2.5">
        <p className="font-mono text-[1.05rem] font-bold text-red-600 leading-tight">
          Are you sure you want to delete your account?
        </p>
        <p className="text-[13.5px] text-gray-500 font-mono tracking-tight leading-relaxed">
          This action is permanent and cannot be undone.
        </p>
      </div>
    </div>

    {/* Buttom*/}
    <div className="bg-gray-50 px-10 py-6 border-t border-gray-100 flex gap-3 w-full  justify-center">
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="px-10 py-3 text-sm font-mono flex-1  text-gray-800 bg-gray-200 hover:bg-gray-200 transition-colors"
      >
        Cancel
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={loading}
        className="px-10 py-3 text-sm font-mono  flex-1 text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {loading ? "Deleting..." : "Yes, delete"}
      </button>
    </div>

  </DialogContent>
</Dialog>
    </>
  );
}